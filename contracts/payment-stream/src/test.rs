#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, Ledger, MockAuth, MockAuthInvoke},
        token, Address, Env, IntoVal, vec, Symbol,
    };

    #[test]
    fn test_create_stream() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let sac = env.register_stellar_asset_contract_v2(admin.clone());
        let token = sac.address();

        let contract_id = env.register_contract(None, PaymentStreamContract);
        let client = PaymentStreamContractClient::new(&env, &contract_id);

        client.initialize(&admin);

        let token_admin = token::StellarAssetClient::new(&env, &token);
        token_admin.mint(&sender, &1000);

        let stream_id = client.create_stream(
            &sender,
            &recipient,
            &token,
            &1000,
            &0,
            &100,
        );

        assert_eq!(stream_id, 1u64);

        let stream = client.get_stream(&stream_id);
        assert_eq!(stream.total_amount, 1000i128);
        assert_eq!(stream.status, StreamStatus::Active);

        let token_client = token::Client::new(&env, &token);
        assert_eq!(token_client.balance(&contract_id), 1000i128);
    }

    #[test]
    fn test_withdrawable_amount() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let sac = env.register_stellar_asset_contract_v2(admin.clone());
        let token = sac.address();

        let contract_id = env.register_contract(None, PaymentStreamContract);
        let client = PaymentStreamContractClient::new(&env, &contract_id);

        client.initialize(&admin);

        let token_admin = token::StellarAssetClient::new(&env, &token);
        token_admin.mint(&sender, &1000);

        let stream_id = client.create_stream(
            &sender,
            &recipient,
            &token,
            &1000,
            &0,
            &100,
        );

        env.ledger().set_timestamp(50);
        let available = client.withdrawable_amount(&stream_id);
        assert_eq!(available, 500i128);
    }

    #[test]
    fn test_withdraw() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let sac = env.register_stellar_asset_contract_v2(admin.clone());
        let token = sac.address();

        let contract_id = env.register_contract(None, PaymentStreamContract);
        let client = PaymentStreamContractClient::new(&env, &contract_id);

        client.initialize(&admin);

        let token_admin = token::StellarAssetClient::new(&env, &token);
        token_admin.mint(&sender, &1000);

        let stream_id = client.create_stream(
            &sender,
            &recipient,
            &token,
            &1000,
            &0,
            &100,
        );

        env.ledger().set_timestamp(50);

        client.withdraw(&stream_id, &300);

        let stream = client.get_stream(&stream_id);
        assert_eq!(stream.withdrawn_amount, 300i128);

        let token_client = token::Client::new(&env, &token);
        assert_eq!(token_client.balance(&recipient), 300i128);
        assert_eq!(token_client.balance(&contract_id), 700i128);
    }

    #[test]
    fn test_withdraw_max() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let sac = env.register_stellar_asset_contract_v2(admin.clone());
        let token = sac.address();

        let contract_id = env.register_contract(None, PaymentStreamContract);
        let client = PaymentStreamContractClient::new(&env, &contract_id);

        client.initialize(&admin);

        let token_admin = token::StellarAssetClient::new(&env, &token);
        token_admin.mint(&sender, &1000);

        let stream_id = client.create_stream(
            &sender,
            &recipient,
            &token,
            &1000,
            &0,
            &100,
        );

        env.ledger().set_timestamp(50);

        client.withdraw_max(&stream_id);

        let stream = client.get_stream(&stream_id);
        assert_eq!(stream.withdrawn_amount, 500i128);

        let token_client = token::Client::new(&env, &token);
        assert_eq!(token_client.balance(&recipient), 500i128);
        assert_eq!(token_client.balance(&contract_id), 500i128);
    }

    #[test]
    fn test_cancel_stream() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let sac = env.register_stellar_asset_contract_v2(admin.clone());
        let token = sac.address();

        let contract_id = env.register_contract(None, PaymentStreamContract);
        let client = PaymentStreamContractClient::new(&env, &contract_id);

        client.initialize(&admin);

        let token_admin = token::StellarAssetClient::new(&env, &token);
        token_admin.mint(&sender, &1000);

        let stream_id = client.create_stream(
            &sender,
            &recipient,
            &token,
            &1000,
            &0,
            &100,
        );

        env.ledger().set_timestamp(50);
        client.withdraw(&stream_id, &500);

        client.cancel_stream(&stream_id);

        let stream = client.get_stream(&stream_id);
        assert_eq!(stream.status, StreamStatus::Canceled);

        let token_client = token::Client::new(&env, &token);
        assert_eq!(token_client.balance(&sender), 500i128);
        assert_eq!(token_client.balance(&contract_id), 0i128);
    }

    #[test]
    fn test_get_nonexistent_stream() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);

        let contract_id = env.register_contract(None, PaymentStreamContract);
        let client = PaymentStreamContractClient::new(&env, &contract_id);

        client.initialize(&admin);

        let result = client.try_get_stream(&999);
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert_eq!(err, soroban_sdk::Error::contract(6));
    }

    #[test]
    fn test_unauthorized_withdraw() {
        let env = Env::default();

        let admin = Address::generate(&env);
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let sac = env.register_stellar_asset_contract_v2(admin.clone());
        let token = sac.address();

        let contract_id = env.register_contract(None, PaymentStreamContract);
        let client = PaymentStreamContractClient::new(&env, &contract_id);

        env.mock_auths(&[
            MockAuth {
                address: &admin,
                invoke: &MockAuthInvoke {
                    contract: &contract_id,
                    fn_name: "initialize",
                    args: (&admin,).into_val(&env),
                    sub_invokes: &[],
                },
            },
            MockAuth {
                address: &sender,
                invoke: &MockAuthInvoke {
                    contract: &contract_id,
                    fn_name: "create_stream",
                    args: (&sender, &recipient, &token, 1000i128, 0u64, 100u64).into_val(&env),
                    sub_invokes: &[],
                },
            },
        ]);

        client.initialize(&admin);

        let token_admin = token::StellarAssetClient::new(&env, &token);
        token_admin.mint(&sender, &1000);

        let stream_id = client.create_stream(
            &sender,
            &recipient,
            &token,
            &1000,
            &0,
            &100,
        );

        env.ledger().set_timestamp(50);

        let result = client.try_withdraw(&stream_id, &300);
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert_eq!(err, soroban_sdk::Error::contract(3));
    }
}