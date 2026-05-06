import React from "react";
import "./offerArt.css";

export default function OfferArt({ variant = "a" }) {
  return (
    <div className={`offerArt offerArt--${variant}`} aria-hidden="true">
      <div className="offerArt__blob offerArt__blob--1" />
      <div className="offerArt__blob offerArt__blob--2" />
      <div className="offerArt__chip" />
      <div className="offerArt__spark offerArt__spark--1" />
      <div className="offerArt__spark offerArt__spark--2" />
    </div>
  );
}
