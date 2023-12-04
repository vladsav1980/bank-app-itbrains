export const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    const [integerPart, decimalPart] = formattedAmount.split(".");
    return (
      <div className={type}>
        <span className="integer-part">{integerPart}</span>.
        <span className="decimal-part">{decimalPart}</span>
      </div>
    );
  };