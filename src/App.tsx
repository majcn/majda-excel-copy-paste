import type { Column } from "react-table";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTable } from "react-table";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FixedButton = styled.button`
  position: fixed;
  bottom: 0px;
  right: 0px;
`;

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }

    tfoot {
      text-align: center;
      tr:first-child {
        td {
          border-top: 2px solid black;
        }
      }
      font-weight: bolder;
    }
  }
`;

type DataType = {
  data: string;
  fixedData: number;
};

type TableProps = {
  columns: Column<DataType>[];
  data: DataType[];
  onCopyClick: () => void;
  onPasteClick: () => void;
};

function Table({ columns, data, onCopyClick, onPasteClick }: TableProps) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        <tr role="row">
          <th colSpan={1} role="columnheader">
            <button onClick={onPasteClick}>Prilepi</button>
          </th>
          <th colSpan={1} role="columnheader">
            <button onClick={onCopyClick}>Kopiraj</button>
          </th>
        </tr>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr role="row">
          <td colSpan={1}>
            <button onClick={onPasteClick}>Prilepi</button>
          </td>
          <td colSpan={1}>
            <button onClick={onCopyClick}>Kopiraj</button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () =>
      [
        {
          Header: "Stari",
          accessor: "data",
        },
        {
          Header: "Pretvorjeni",
          accessor: "fixedData",
        },
      ] as Column<DataType>[],
    []
  );

  const [data, setData] = useState<DataType[]>([]);

  const notify = () => toast.success("Skopirano!");

  const onCopyClick = () => {
    const textToPaste = data.map((x) => x.fixedData).join("\n");
    navigator.clipboard.writeText(textToPaste).then(notify);
  };

  const onPasteClick = async () => {
    const text = await navigator.clipboard.readText();

    const textAsArray = text.split(/\r?\n/);

    const fixedData = [];
    let prev = -1;
    for (let line of textAsArray) {
      if (line === "null" || line === "NULL") {
        fixedData.push(prev);
      } else {
        const lineAsNumber = Number(line);
        fixedData.push(lineAsNumber);
        prev = lineAsNumber;
      }
    }

    const result = [] as DataType[];
    for (let i = 0; i < textAsArray.length; i++) {
      result.push({ data: textAsArray[i], fixedData: fixedData[i] });
    }

    setData(result);
  };

  return (
    <>
      <ToastContainer />
      <Styles>
        <Table
          onCopyClick={onCopyClick}
          onPasteClick={onPasteClick}
          columns={columns}
          data={data}
        />
      </Styles>
    </>
  );
}

export default App;
