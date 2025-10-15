import { useRouter } from "next/navigation";
import React from "react";

interface CommunicationRowProps {
  name?: string;
  email?: string;
  status?: string;
  inquiry_type?: string;
  actionItem?: string;
  checked?: boolean;
  onCheck?: () => void;
}

const CommunicationRow: React.FC<CommunicationRowProps> = ({
  name,
  email,
  status,
  inquiry_type,
  actionItem,
  checked = false,
  onCheck,
}) => {
  const router = useRouter();

  const handleClick = () => {
    // Example navigation if needed:
    // router.push(`/dashboard/lead/${lead_id}?page=1`);
  };

  return (
    <div
      style={{
        ...styles.row,
        backgroundColor: checked ? "#E4E4E4" : "#fff",
      }}
      className="row"
      onClick={handleClick}
    >
      <input
        type="checkbox"
        checked={checked}
        // onChange={onCheck}
        style={styles.checkbox}
        onChange={(e) => {
          e.stopPropagation();
          e.preventDefault(); 
          onCheck?.();
        }}
      />
      <div style={actionItem ? styles.cellNameNew : styles.cellName}>
        {name || "—"}
      </div>
      {email && <div style={styles.cell}>{email || "—"}</div>}
      {status && <div style={styles.cell}>{status || "—"}</div>}
      {inquiry_type && <div style={styles.cell}>{inquiry_type || "—"}</div>}
      {actionItem && <div style={styles.cell}>{actionItem}</div>}
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    margin: "2px 0",
    width: "100%",
    flex: 1,
    transition: "background-color 0.2s ease",
    borderBottom: "1px solid #E4E4E4",
    cursor: "pointer",
  } as React.CSSProperties,
  checkbox: {
    marginRight: "12px",
  } as React.CSSProperties,
  cell: {
    flex: 1,
    padding: "0 8px",
    fontSize: 14,
  } as React.CSSProperties,
  cellName: {
    flex: 0.8,
    padding: "0 8px",
    fontWeight: 500,
    fontSize: 14,
  } as React.CSSProperties,
  cellNameNew: {
    flex: 0.5,
    padding: "0 8px",
    fontWeight: 500,
    fontSize: 14,
  } as React.CSSProperties,
};

export default CommunicationRow;
