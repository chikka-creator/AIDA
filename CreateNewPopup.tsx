"use client";
import React, { useEffect, useRef, useState } from "react";
import "./CreateNewPopup.css";
import {
  Edit3,
  PlusCircle,
  Trash2,
  Camera,
  FolderOpen,
  X,
} from "lucide-react";

/**
 * Stages:
 * - "closed"  -> initial
 * - "edit"    -> Edit popup (compact wide)
 * - "add"     -> Add Product (taller)
 */
type Stage = "closed" | "edit" | "add";

const EXPAND_DURATION = 350; // ms for box expand/shrink
const CONTENT_FADE = 220; // ms for content fade in/out

export default function SmartCreatePopup() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<Stage>("closed");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // HANDLE OUTSIDE CLICK
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!wrapperRef.current) return;
      const target = ev.target as Node;
      if (!wrapperRef.current.contains(target) && stage !== "closed") {
        closeAll();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [stage]);

  // OPEN to EDIT (from closed)
  const openToEdit = () => {
    if (isAnimating || stage !== "closed") return;
    setIsAnimating(true);
    setStage("edit"); // start expanding to edit
    // after expand, show content
    setTimeout(() => {
      setShowContent(true);
      setIsAnimating(false);
    }, EXPAND_DURATION);
  };

  // TRANSITION edit -> add (expand further)
  const goToAddProduct = () => {
    if (isAnimating || stage !== "edit") return;
    setIsAnimating(true);
    // fade out edit content first
    setShowContent(false);
    setTimeout(() => {
      // now expand to add
      setStage("add"); // CSS will handle size
      setTimeout(() => {
        // when expand finished, show add content
        setShowContent(true);
        setIsAnimating(false);
      }, EXPAND_DURATION);
    }, CONTENT_FADE);
  };

  // go back from add to edit (if needed)
  const backToEdit = () => {
    if (isAnimating || stage !== "add") return;
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setStage("edit");
      setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, EXPAND_DURATION);
    }, CONTENT_FADE);
  };

  // CLOSE sequence: content fade-out -> shrink -> closed
  const closeAll = () => {
    if (isAnimating || stage === "closed") return;
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      // shrink to closed
      setStage("closed");
      setTimeout(() => {
        setIsAnimating(false);
      }, EXPAND_DURATION);
    }, CONTENT_FADE);
  };

  // helper to stop propagation on internal clicks
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="smart-wrapper" ref={wrapperRef}>
      {/* Box: class depends on stage */}
      <div
        className={[
          "smart-box",
          stage === "closed" ? "state-closed" : "",
          stage === "edit" ? "state-edit" : "",
          stage === "add" ? "state-add" : "",
          isAnimating ? "animating" : "",
        ].join(" ")}
        onClick={() => {
          if (stage === "closed") openToEdit();
        }}
      >
        {/* When closed, show button text */}
        {stage === "closed" && !isAnimating && (
          <span className="btn-label">Create New</span>
        )}

        {/* Header area (visible on edit & add) */}
        {(stage === "edit" || stage === "add" || isAnimating) && (
          <div
            className={[
              "box-inner",
              showContent ? "content-visible" : "content-hidden",
            ].join(" ")}
            onClick={stop}
          >
            {/* Header (green) */}
            <div
              className={[
                "header",
                stage === "edit" ? "header-edit" : "",
                stage === "add" ? "header-add" : "",
              ].join(" ")}
            >
              <div className="header-left">
                <div className="pencil-box">
                  <Edit3 size={20} />
                </div>
                <div className="header-title">
                  {stage === "edit" ? "Edit" : "Add Product"}
                </div>
              </div>

              <button
                className="icon-close"
                onClick={(e) => {
                  e.stopPropagation();
                  // Closing should always go back to closed
                  closeAll();
                }}
                aria-label="close"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* CONTENT: Edit view */}
            {stage === "edit" && (
              <div
                className={[
                  "content-area edit-area",
                  showContent ? "fade-in" : "fade-out",
                ].join(" ")}
              >
                <div className="edit-buttons">
                  <button
                    className="edit-action add"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToAddProduct();
                    }}
                  >
                    <PlusCircle size={22} />
                    <span>Add Product</span>
                  </button>

                  <button
                    className="edit-action trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      // trash action (UI-only)
                      // small visual feedback: briefly flash
                      (e.currentTarget as HTMLButtonElement).classList.add(
                        "flash"
                      );
                      setTimeout(
                        () =>
                          (e.currentTarget as HTMLButtonElement).classList.remove(
                            "flash"
                          ),
                        350
                      );
                    }}
                  >
                    <Trash2 size={22} />
                    <span>Trash Product</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONTENT: Add Product view */}
            {stage === "add" && (
              <div
                className={[
                  "content-area add-area",
                  showContent ? "fade-in" : "fade-out",
                ].join(" ")}
              >
                <div className="photo-row">
                  <button
                    className="photo-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Camera size={28} />
                    <span>Take Photo</span>
                  </button>

                  <button
                    className="photo-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <FolderOpen size={28} />
                    <span>Add Photo</span>
                  </button>
                </div>

                <form
                  className="add-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // UI-only
                    // animate button for feedback
                    const btn = e.currentTarget.querySelector(
                      ".submit"
                    ) as HTMLButtonElement | null;
                    if (btn) {
                      btn.classList.add("clicked");
                      setTimeout(() => btn.classList.remove("clicked"), 350);
                    }
                  }}
                >
                  <input
                    className="input"
                    placeholder="Name Product"
                    aria-label="Name Product"
                  />
                  <input
                    className="input"
                    placeholder="Deskripsi Product"
                    aria-label="Deskripsi Product"
                  />
                  <input
                    className="input"
                    placeholder="Price Product"
                    aria-label="Price Product"
                  />

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        // back to edit
                        backToEdit();
                      }}
                    >
                      Back
                    </button>

                    <button type="submit" className="submit">
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
