import FeatureCard from "./FeatureCard";

const FeatureCards = () => {
    const stream =
        "Set up automated crypto payments once, run forever. Handle subscriptions, salaries, and recurring transfers automatically on Stellar.";

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 md:gap-8">
            <FeatureCard
                title="Payment Stream"
                linkText="Create Stream"
                description={stream}
                link="/payment-stream"
            />
        </div>
    );
};

export default FeatureCards;
