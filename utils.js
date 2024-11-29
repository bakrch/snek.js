export function generateTable(rows) {
  // Create a table element
  const table = document.createElement("table");

  // Loop through rows and columns to create table cells
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");  // Create a row
    for (let j = 0; j < rows; j++) {
      const cell = document.createElement("td");  // Create a cell
      cell.textContent = ``;  // Add text to the cell
      row.appendChild(cell);  // Append cell to the row
    }
    table.appendChild(row);  // Append row to the table
  }

  // Append the table to the div with id "table-container"
  return document.getElementById("table-container").appendChild(table);
}

export function colorCell(table, rowIndex, colIndex, color) {
  const row = table.rows[rowIndex];
  if (row) {
    const cell = row.cells[colIndex];
    if (cell) {
      cell.style.backgroundColor = color;
    } else {
      console.error("Invalid column index.");
    }
  } else {
    console.error("Invalid row index.");
  }
}

