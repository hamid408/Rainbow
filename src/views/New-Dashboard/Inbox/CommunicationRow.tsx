import React from "react";

const CommunicationRow = ({
  name,
  status,
  actionItem,
  checked,
  onCheck,
}: any) => {
  return (
    <div style={styles.row}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        style={styles.checkbox}
      />
      <div style={styles.cellName}>{name}</div>
      <div style={styles.cell}>{status}</div>
      <div style={styles.cell}>{actionItem}</div>
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  checkbox: {
    marginRight: "12px",
  },
  cell: {
    flex: 1,
    padding: "0 8px",
    fontSize: 14,
  },
  cellName: {
    flex: 1,
    padding: "0 8px",
    fontWeight: 500,
    fontSize: 14,
  },
};

export default CommunicationRow;
