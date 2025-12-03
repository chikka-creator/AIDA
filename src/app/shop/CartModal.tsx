import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  X,
  Wallet,
  Building2,
  QrCode,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type PaymentMethod = "E_WALLET" | "BANK_TRANSFER" | "QRIS" | "CREDIT_CARD";
type PaymentProvider =
  | "DANA"
  | "OVO"
  | "GOPAY"
  | "SHOPEEPAY"
  | "BCA"
  | "MANDIRI"
  | "BNI"
  | "BRI";

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: string;
}

interface CartModalProps {
  onClose: () => void;
  items: { p: Product; qty: number }[];
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

export default function ImprovedCartModal({
  onClose,
  items,
  onRemove,
  onClearCart,
}: CartModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState<
    "cart" | "payment" | "awaiting" | "success" | "failed"
  >("cart");

  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("E_WALLET");
  const [paymentProvider, setPaymentProvider] =
    useState<PaymentProvider>("DANA");

  const [purchaseId, setPurchaseId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState("");
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900);
  const [autoCheckInterval, setAutoCheckInterval] =
    useState<NodeJS.Timeout | null>(null);

  const total = items.reduce((s, it) => s + it.qty * it.p.price, 0);

  // Timer for payment expiration
  useEffect(() => {
    if (step === "awaiting" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setError("Payment time expired. Please try again.");
            setStep("failed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeRemaining]);

  // Auto-check payment status every 3 seconds
  useEffect(() => {
    if (step === "awaiting" && purchaseId) {
      const checkPayment = async () => {
        try {
          const response = await fetch(`/api/payments/check/${purchaseId}`);
          if (!response.ok) return;

          const data = await response.json();
          console.log("Payment check result:", data);

          if (data.status === "COMPLETED") {
            if (autoCheckInterval) {
              clearInterval(autoCheckInterval);
              setAutoCheckInterval(null);
            }
            setTransactionId(data.transactionId);
            setStep("success");
            setTimeout(() => {
              onClearCart();
            }, 500);
          } else if (data.status === "FAILED") {
            if (autoCheckInterval) {
              clearInterval(autoCheckInterval);
              setAutoCheckInterval(null);
            }
            setError("Payment verification failed");
            setStep("failed");
          }
        } catch (err) {
          console.error("Error checking payment:", err);
        }
      };

      // Initial check
      checkPayment();

      // Set up interval for automatic checks
      const interval = setInterval(checkPayment, 3000);
      setAutoCheckInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [step, purchaseId]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (autoCheckInterval) {
        clearInterval(autoCheckInterval);
      }
    };
  }, [autoCheckInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    if (autoCheckInterval) {
      clearInterval(autoCheckInterval);
    }
    setClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === "E_WALLET") setPaymentProvider("DANA");
    else if (method === "BANK_TRANSFER") setPaymentProvider("BCA");
  };

  const handleProceedToPayment = () => {
    if (!session?.user) {
      setError("Please login to continue");
      return;
    }

    if (!username.trim() || !whatsapp.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setStep("payment");
  };

  const handleCreatePayment = async () => {
    setError("");

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.p.id,
            quantity: item.qty,
          })),
          paymentMethod: paymentProvider,
          paymentType: paymentMethod,
          username,
          whatsapp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to create payment"
        );
      }

      setPurchaseId(data.purchase.id);
      setPaymentData(data.paymentData);
      setStep("awaiting");
      setTimeRemaining(900);
    } catch (err: any) {
      setError(err.message || "Failed to create payment");
    }
  };

  const handleManualVerify = async () => {
    setCheckingPayment(true);
    setError("");

    try {
      const response = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId,
          status: "success",
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (autoCheckInterval) {
          clearInterval(autoCheckInterval);
          setAutoCheckInterval(null);
        }
        setTransactionId(data.purchase.transactionId);
        setStep("success");
        setTimeout(() => {
          onClearCart();
        }, 500);
      } else {
        setError("Payment not yet received. Please complete the payment.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify payment");
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleRetry = () => {
    if (autoCheckInterval) {
      clearInterval(autoCheckInterval);
      setAutoCheckInterval(null);
    }
    setStep("payment");
    setError("");
    setTimeRemaining(900);
  };

  const handleGoToLibrary = () => {
    router.push("/owned-products");
    handleClose();
  };

  return (
    <div
      className={`cart-overlay-new ${closing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`cart-modal-new ${step}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title-new">
            {step === "cart" && "Shopping Cart"}
            {step === "payment" && "Payment Method"}
            {step === "awaiting" && "Complete Your Payment"}
            {step === "success" && "Payment Successful!"}
            {step === "failed" && "Payment Failed"}
          </h2>
          <button className="cart-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Step */}
        {step === "cart" && (
          <div className="cart-content-new">
            <div className="cart-items-section">
              <h3>Items ({items.length})</h3>
              {items.map(({ p, qty }) => (
                <div className="cart-item-new" key={p.id}>
                  <img src={p.image} alt={p.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{p.title}</h4>
                    <p className="cart-item-price">
                      IDR {p.price.toLocaleString()}
                    </p>
                    <p className="cart-item-qty">Quantity: {qty}</p>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => onRemove(p.id)}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-amount">
                  IDR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="cart-form-section">
              <h3>Contact Information</h3>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Number *</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="form-input"
                  disabled={!!session?.user?.email}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button
                className="proceed-btn"
                onClick={handleProceedToPayment}
                disabled={!session?.user}
              >
                {session?.user ? "Proceed to Payment" : "Login to Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Payment Method Selection */}
        {step === "payment" && (
          <div className="payment-content">
            <div className="payment-methods-grid">
              <div
                className={`payment-method-card ${
                  paymentMethod === "E_WALLET" ? "active" : ""
                }`}
                onClick={() => handlePaymentMethodChange("E_WALLET")}
              >
                <Wallet size={32} />
                <h4>E-Wallet</h4>
                <p>DANA, OVO, GoPay, ShopeePay</p>
              </div>
              <div
                className={`payment-method-card ${
                  paymentMethod === "BANK_TRANSFER" ? "active" : ""
                }`}
                onClick={() => handlePaymentMethodChange("BANK_TRANSFER")}
              >
                <Building2 size={32} />
                <h4>Bank Transfer</h4>
                <p>BCA, Mandiri, BNI, BRI</p>
              </div>
              <div
                className={`payment-method-card ${
                  paymentMethod === "QRIS" ? "active" : ""
                }`}
                onClick={() => handlePaymentMethodChange("QRIS")}
              >
                <QrCode size={32} />
                <h4>QRIS</h4>
                <p>Scan QR Code</p>
              </div>
              <div
                className={`payment-method-card ${
                  paymentMethod === "CREDIT_CARD" ? "active" : ""
                }`}
                onClick={() => handlePaymentMethodChange("CREDIT_CARD")}
              >
                <CreditCard size={32} />
                <h4>Credit Card</h4>
                <p>Visa, Mastercard</p>
              </div>
            </div>

            {paymentMethod === "E_WALLET" && (
              <div className="provider-selection">
                <h4>Select E-Wallet Provider</h4>
                <div className="provider-buttons">
                  {(
                    ["DANA", "OVO", "GOPAY", "SHOPEEPAY"] as PaymentProvider[]
                  ).map((provider) => (
                    <button
                      key={provider}
                      className={`provider-btn ${
                        paymentProvider === provider ? "active" : ""
                      }`}
                      onClick={() => setPaymentProvider(provider)}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === "BANK_TRANSFER" && (
              <div className="provider-selection">
                <h4>Select Bank</h4>
                <div className="provider-buttons">
                  {(["BCA", "MANDIRI", "BNI", "BRI"] as PaymentProvider[]).map(
                    (provider) => (
                      <button
                        key={provider}
                        className={`provider-btn ${
                          paymentProvider === provider ? "active" : ""
                        }`}
                        onClick={() => setPaymentProvider(provider)}
                      >
                        {provider}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="payment-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>IDR {total.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>IDR {total.toLocaleString()}</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="payment-actions">
              <button className="back-btn" onClick={() => setStep("cart")}>
                Back
              </button>
              <button className="pay-btn" onClick={handleCreatePayment}>
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Awaiting Payment Completion */}
        {step === "awaiting" && (
          <div className="processing-content">
            {paymentData && paymentData.type === "QRIS" && (
              <>
                {/* Timer warning at top for QRIS */}
                <div
                  style={{
                    background: "#fff3cd",
                    border: "2px solid #ffc107",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <AlertCircle size={24} color="#856404" />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        color: "#856404",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      Please Complete Your Payment
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#856404",
                        fontSize: "14px",
                      }}
                    >
                      Time remaining: {formatTime(timeRemaining)}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#856404",
                        fontSize: "12px",
                      }}
                    >
                      ✓ Checking payment automatically every 3 seconds...
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "white",
                    padding: "32px",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    marginBottom: "24px",
                  }}
                >
                  <h3 style={{ marginBottom: "16px", color: "#111827" }}>
                    Scan QR Code to Pay
                  </h3>
                  <img
                    src="/qris_payment.webp"
                    alt="QRIS Payment"
                    style={{
                      width: "300px",
                      height: "300px",
                      margin: "0 auto",
                      display: "block",
                      border: "3px solid #e5e7eb",
                      borderRadius: "12px",
                    }}
                  />
                  <p
                    style={{
                      marginTop: "16px",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {paymentData.merchantName || "AIDA Creative"}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#6b7280",
                      marginTop: "8px",
                    }}
                  >
                    Amount: IDR {paymentData.amount?.toLocaleString()}
                  </p>

                  {paymentData.instructions && (
                    <div
                      style={{
                        marginTop: "24px",
                        textAlign: "left",
                        background: "#f9fafb",
                        padding: "16px",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          marginBottom: "12px",
                          color: "#111827",
                        }}
                      >
                        How to pay:
                      </p>
                      <ol
                        style={{
                          margin: 0,
                          paddingLeft: "20px",
                          color: "#6b7280",
                          lineHeight: "1.8",
                        }}
                      >
                        {paymentData.instructions.map(
                          (instruction: string, index: number) => (
                            <li key={index}>{instruction}</li>
                          )
                        )}
                      </ol>
                    </div>
                  )}
                </div>
              </>
            )}

            {paymentData && paymentData.type === "E_WALLET" && (
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* Header with timer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    gap: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {paymentProvider} Payment
                  </h3>
                  <div
                    style={{
                      background: "#fff3cd",
                      border: "2px solid #ffc107",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#856404",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Time Left
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: "#856404",
                        fontSize: "18px",
                        fontWeight: "700",
                      }}
                    >
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                </div>

                {/* Payment details */}
                <div
                  style={{
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Total Amount
                  </p>
                  <p
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      color: "#246E76",
                      margin: "0 0 16px 0",
                    }}
                  >
                    IDR {paymentData.amount?.toLocaleString()}
                  </p>
                </div>

                {/* Action button or QR */}
                {paymentData.checkoutUrl ? (
                  <a
                    href={paymentData.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "14px",
                      background: "#246E76",
                      color: "white",
                      textAlign: "center",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    Open {paymentProvider} App →
                  </a>
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      background: "#f9fafb",
                      borderRadius: "10px",
                      textAlign: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      Please complete payment in your {paymentProvider} app
                    </p>
                  </div>
                )}

                {/* Auto-check indicator */}
                <div
                  style={{
                    padding: "10px",
                    background: "#f0f9ff",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#3b82f6",
                      borderRadius: "50%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#1e40af",
                    }}
                  >
                    Checking payment automatically every 3 seconds...
                  </p>
                </div>
              </div>
            )}

            {paymentData && (paymentData.type === "CREDIT_CARD" || paymentData.type === "INVOICE") && (
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* Header with timer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    gap: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Complete Payment
                  </h3>
                  <div
                    style={{
                      background: "#fff3cd",
                      border: "2px solid #ffc107",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#856404",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Time Left
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: "#856404",
                        fontSize: "18px",
                        fontWeight: "700",
                      }}
                    >
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                </div>

                {/* Payment details */}
                <div
                  style={{
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Total Amount
                  </p>
                  <p
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      color: "#246E76",
                      margin: "0 0 16px 0",
                    }}
                  >
                    IDR {paymentData.amount?.toLocaleString() || total.toLocaleString()}
                  </p>
                </div>

                {/* Invoice URL if available */}
                {paymentData.invoiceUrl ? (
                  <a
                    href={paymentData.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "14px",
                      background: "#246E76",
                      color: "white",
                      textAlign: "center",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    Open Payment Page →
                  </a>
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      background: "#f9fafb",
                      borderRadius: "10px",
                      textAlign: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      Please complete the payment process
                    </p>
                  </div>
                )}

                {/* Auto-check indicator */}
                <div
                  style={{
                    padding: "10px",
                    background: "#f0f9ff",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#3b82f6",
                      borderRadius: "50%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#1e40af",
                    }}
                  >
                    Checking payment automatically every 3 seconds...
                  </p>
                </div>
              </div>
            )}

            {paymentData && paymentData.type === "BANK_TRANSFER" && (
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* Header with timer on the right */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    gap: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Transfer to {paymentData.bank}
                  </h3>
                  <div
                    style={{
                      background: "#fff3cd",
                      border: "2px solid #ffc107",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#856404",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Time Left
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: "#856404",
                        fontSize: "18px",
                        fontWeight: "700",
                      }}
                    >
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                </div>

                {/* Payment details in compact grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      Account Number
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {paymentData.accountNumber}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      Amount
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#246E76",
                        margin: 0,
                      }}
                    >
                      IDR {paymentData.amount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Account Name
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {paymentData.accountName}
                  </p>
                </div>

                {/* Auto-check indicator */}
                <div
                  style={{
                    marginTop: "16px",
                    padding: "10px",
                    background: "#f0f9ff",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#3b82f6",
                      borderRadius: "50%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#1e40af",
                    }}
                  >
                    Checking payment automatically every 3 seconds...
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleManualVerify}
              disabled={checkingPayment}
              style={{
                width: "100%",
                padding: "16px",
                background: checkingPayment ? "#9ca3af" : "#246E76",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: checkingPayment ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {checkingPayment ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "3px solid rgba(255,255,255,0.3)",
                      borderTop: "3px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Verifying Payment...
                </>
              ) : (
                <>I've Already Paid - Check Now</>
              )}
            </button>

            {error && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  background: "#fee2e2",
                  borderRadius: "8px",
                  color: "#991b1b",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
          </div>
        )}

        {/* Success Screen */}
        {step === "success" && (
          <div className="success-content">
            <div className="success-icon">
              <CheckCircle size={60} />
            </div>
            <h3>Payment Successful!</h3>
            <p>
              Your payment has been processed successfully. Thank you for your
              purchase!
            </p>

            <div className="success-details">
              <div className="detail-row">
                <span>Transaction ID:</span>
                <span style={{ fontWeight: "600" }}>{transactionId}</span>
              </div>
              <div className="detail-row">
                <span>Amount:</span>
                <span style={{ fontWeight: "600" }}>
                  IDR {total.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span>Items:</span>
                <span style={{ fontWeight: "600" }}>
                  {items.length} product(s)
                </span>
              </div>
            </div>

            <button className="library-btn" onClick={handleGoToLibrary}>
              Go to My Library
            </button>
          </div>
        )}

        {/* Failed Screen */}
        {step === "failed" && (
          <div className="failed-content">
            <div className="failed-icon">✕</div>
            <h3>Payment Failed</h3>
            <p>We couldn't process your payment.</p>
            {error && <p className="error-detail">{error}</p>}

            <div className="failed-actions">
              <button className="retry-btn" onClick={handleRetry}>
                Try Again
              </button>
              <button className="cancel-btn" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
