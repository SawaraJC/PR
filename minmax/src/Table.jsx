// DynamicTable.js
import React, { useState } from 'react';

const DeleteConfirmationModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <p className="mb-4">Are you sure you want to delete the selected rows?</p>
        <div className="flex justify-end">
          <button onClick={onConfirm} className="bg-red-500 text-white p-2 rounded mr-2">
            Yes
          </button>
          <button onClick={onCancel} className="bg-blue-500 text-white p-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Table = () => {
  const [tableData, setTableData] = useState([Array(8).fill('')]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [rowErrors, setRowErrors] = useState(Array(1).fill(false));

  const addRow = () => {
    setTableData([...tableData, Array(8).fill('')]);
    setRowErrors([...rowErrors, false]);
  };

  const handleChange = (rowIndex, columnIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][columnIndex] = value;

    // Validate and update row error status for integer entries
    const isInteger = Number.isInteger(Number(value));
    const isInvalidMin = columnIndex === 5 && (value !== '' && !isInteger);

    setRowErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[rowIndex] = isInvalidMin;
      return newErrors;
    });

    if (isInvalidMin) {
      return; // Do not update the state if Min column has an invalid entry
    }

    setTableData(newData);
  };

  const toggleRowSelection = (rowIndex) => {
    const isSelected = selectedRows.includes(rowIndex);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((row) => row !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  const handleDeleteClick = () => {
    if (selectedRows.length > 0) {
      setShowDeleteConfirmation(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const deleteSelectedRows = () => {
    const newData = tableData.filter((_, index) => !selectedRows.includes(index));
    setTableData(newData);
    setRowErrors((prevErrors) =>
      prevErrors.filter((_, index) => !selectedRows.includes(index))
    );
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
  };

  const saveTable = () => {
    // Save the table data to local storage
    localStorage.setItem('tableData', JSON.stringify(tableData));
    console.log('Table data saved to local storage:', tableData);
  };

  return (
    <div className="overflow-x-auto max-w-screen-lg mx-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border p-2">Supplier name</th>
            <th className="border p-2">Item_id</th>
            <th className="border p-2">Balance Qty</th>
            <th className="border p-2">Daily Run Rate</th>
            <th className="border p-2">Safety Stock</th>
            <th className="border p-2">Min</th>
            <th className="border p-2">Max</th>
            <th className="border p-2">Reorder Qty</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                selectedRows.includes(rowIndex) || rowErrors[rowIndex] ? 'bg-red-200' : ''
              }
              onClick={() => toggleRowSelection(rowIndex)}
            >
              {row.map((cell, columnIndex) => (
                <td key={columnIndex} className="border p-2">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleChange(rowIndex, columnIndex, e.target.value)}
                    className={`w-full outline-none ${
                      columnIndex >= 2 && columnIndex <= 7 ? 'text-right' : ''
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Add Row
      </button>
      <button
        onClick={handleDeleteClick}
        className="ml-4 mt-4 bg-red-500 text-white p-2 rounded"
        disabled={selectedRows.length === 0}
      >
        Delete Selected Rows
      </button>
      {showDeleteConfirmation && (
        <DeleteConfirmationModal onCancel={handleCancelDelete} onConfirm={deleteSelectedRows} />
      )}
      <button onClick={saveTable} className="ml-4 mt-4 bg-green-500 text-white p-2 rounded">
        Save Table
      </button>
    </div>
  );
};

export default Table;
