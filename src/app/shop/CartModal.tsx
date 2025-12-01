// src/app/shop/CartModal.tsx
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Product } from "./page";
import { X, Wallet, Building2, QrCode, CreditCard } from "lucide-react";
import "./Cart.css";

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

interface ImprovedCartModalProps {
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
}: ImprovedCartModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState<
    "cart" | "payment" | "processing" | "success" | "failed"
  >("cart");

  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("E_WALLET");
  const [paymentProvider, setPaymentProvider] =
    useState<PaymentProvider>("DANA");

  const [purchaseId, setPurchaseId] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState("");

  const total = items.reduce((s, it) => s + it.qty * it.p.price, 0);

  const handleClose = () => {
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
  setStep('processing');
  setError('');

  try {
    console.log('Creating payment...');
    console.log('Items:', items);
    console.log('Payment Method:', paymentProvider);
    console.log('Payment Type:', paymentMethod);
    
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => ({
          productId: item.p.id,
          quantity: item.qty,
        })),
        paymentMethod: paymentProvider,
        paymentType: paymentMethod,
        username,
        whatsapp,
      }),
    });

    console.log('Response status:', response.status);
    
    // Get response text first
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
    }

    console.log('Response data:', data);

    if (!response.ok) {
      // Show the actual error from server
      throw new Error(data.details || data.error || 'Failed to create payment');
    }

    setPurchaseId(data.purchase.id);
    setPaymentData(data.paymentData);

    // Auto-simulate payment after 3 seconds
    setTimeout(() => {
      simulatePaymentResult(data.purchase.id);
    }, 3000);

  } catch (err: any) {
    console.error('Payment creation error:', err);
    setError(err.message || 'Failed to create payment');
    setStep('payment'); // Go back to payment selection
  }
};

  const simulatePaymentResult = async (purchaseId: string) => {
    try {
      const isSuccess = Math.random() > 0.2;

      // FIXED: Changed from /api/payment/simulate to /api/payments/simulate
      const response = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchaseId,
          status: isSuccess ? "success" : "failed",
        }),
      });

      const data = await response.json();

      if (isSuccess && data.success) {
        setStep("success");
        setTimeout(() => {
          onClearCart();
        }, 500);
      } else {
        setStep("failed");
      }
    } catch (err: any) {
      console.error("Payment simulation error:", err);
      setError(err.message || "Payment processing failed");
      setStep("failed");
    }
  };

  const handleRetry = () => {
    setStep("payment");
    setError("");
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
            {step === "processing" && "Processing Payment"}
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

        {/* Payment Method Selection Step */}
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
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Processing, Success, Failed steps remain the same */}
        {step === "processing" && (
          <div className="processing-content">
            <div className="processing-spinner"></div>
            <h3>Processing Your Payment</h3>
            <p>Please wait while we process your payment...</p>

            {/* QRIS QR Code Display */}
            {paymentData && paymentData.type === "QRIS" && (
              <div className="qris-container" style={{ marginTop: "32px" }}>
                {/* Display the actual QR code image */}
                {paymentData.qrCodeUrl ? (
                  <div
                    style={{
                      background: "white",
                      padding: "24px",
                      borderRadius: "16px",
                      textAlign: "center",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={paymentData.qrCodeUrl}
                      alt="QRIS QR Code"
                      style={{
                        width: "280px",
                        height: "280px",
                        margin: "0 auto",
                        display: "block",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
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
                        marginTop: "4px",
                      }}
                    >
                      Amount: IDR {paymentData.amount?.toLocaleString()}
                    </p>

                    {/* Payment Instructions */}
                    {paymentData.instructions && (
                      <div
                        style={{
                          marginTop: "20px",
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
                            fontSize: "14px",
                          }}
                        >
                          How to pay:
                        </p>
                        <ol
                          style={{
                            margin: 0,
                            paddingLeft: "20px",
                            color: "#6b7280",
                            fontSize: "13px",
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

                    {/* Expiry Timer */}
                    {paymentData.expiryTime && (
                      <p
                        style={{
                          marginTop: "16px",
                          fontSize: "13px",
                          color: "#ef4444",
                          fontWeight: "500",
                        }}
                      >
                        ⏰ Expires:{" "}
                        {new Date(paymentData.expiryTime).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                ) : (
                  // Fallback if no QR code URL provided
                  <div
                    className="qris-placeholder"
                    style={{
                      background: "#f9fafb",
                      padding: "40px",
                      borderRadius: "16px",
                      border: "2px dashed #d1d5db",
                      textAlign: "center",
                    }}
                  >
                    <QrCode
                      size={200}
                      style={{ color: "#246E76", margin: "0 auto 16px" }}
                    />
                    <p
                      style={{ fontSize: "16px", color: "#6b7280", margin: 0 }}
                    >
                      Scan with your mobile banking app
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#ef4444",
                        marginTop: "12px",
                      }}
                    >
                      ⚠️ QR Code image not configured. Please contact support.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Other payment types */}
            {paymentData && paymentData.type === "BANK_TRANSFER" && (
              <div
                style={{
                  marginTop: "24px",
                  background: "#f9fafb",
                  padding: "24px",
                  borderRadius: "12px",
                  maxWidth: "400px",
                  margin: "24px auto 0",
                }}
              >
                <h4 style={{ marginBottom: "16px", color: "#111827" }}>
                  Transfer to {paymentData.bank}
                </h4>
                <div style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Account Number:
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {paymentData.accountNumber}
                  </p>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Account Name:
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {paymentData.accountName}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Amount:
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#246E76",
                    }}
                  >
                    IDR {paymentData.amount?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
