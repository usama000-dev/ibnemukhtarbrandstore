"use client"
import React, { useState } from "react";
import { Typography, IconButton } from "@mui/material";
import { FiCopy, FiCheck } from "react-icons/fi";

interface CopyAddressProps {
  text: string;
}

const CopyAddress: React.FC<CopyAddressProps> = ({ text }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Typography variant="h6" fontWeight={600}>
        {text}
      </Typography>

      <IconButton onClick={handleCopy} size="small">
        {copied ? (
          <FiCheck size={20} color="green" />
        ) : (
          <FiCopy size={20} />
        )}
      </IconButton>
    </div>
  );
};

export default CopyAddress;
