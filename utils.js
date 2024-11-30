export function generateTable(rows) {
  const table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < rows; j++) {
      const cell = document.createElement("td");
      cell.textContent = ``;
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

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

