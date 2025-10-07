import React from "react";

const AiOutReachRow = ({ name, status, checked, onCheck }: any) => {
  return (
    <>
      <div style={styles.row}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          style={styles.checkbox}
        />
        <div style={styles.cellName}>{name}</div>
        <div style={styles.cell}>{status}</div>
        {/* <div style={styles.cell}>{actionItem}</div> */}
      </div>
    </>
  );
};

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    margin: "2px 0",
    backgroundColor: "#f9f9f9",
    width: "100%",
    flex: 1,
    transition: "background-color 0.2s ease",
    borderBottom: "1px solid #E4E4E4",
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
    flex: 0.5,
    padding: "0 8px",
    fontWeight: 500,
    fontSize: 14,
  },
};

export default AiOutReachRow;
