import { useState, useEffect } from "react";

import classnames from "classnames";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type DataType = {
  data: string;
  fixedData: string;
};

type TableProps = {
  data: DataType[];
  headers: string[];
};

function TableRow({ data }: { data: DataType }) {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {data.data}
      </td>
      <td
        className={classnames(
          data.data !== data.fixedData.toString()
            ? "text-white bg-red-500"
            : "text-gray-500 dark:text-gray-400",
          "py-4 px-6 text-sm whitespace-nowrap"
        )}
      >
        {data.fixedData}
      </td>
    </tr>
  );
}

function TableHeader({ title }: { title: string }) {
  return (
    <th
      scope="col"
      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
    >
      {title}
    </th>
  );
}

function Table({ data, headers }: TableProps) {
  return (
    <div className="w-1/3 mx-auto flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {headers.map((el, i) => (
                    <TableHeader key={i} title={el} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((el, i) => (
                  <TableRow key={i} data={el} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[100px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      {text}
    </button>
  );
}

function App() {
  const [data, setData] = useState<DataType[]>([]);

  const onCopyClick = () => {
    const textToPaste = data.map((x) => x.fixedData).join("\n");
    navigator.clipboard
      .writeText(textToPaste)
      .then(() => toast.success("Skopirano"));
  };

  const onPasteClick = async () => {
    const text = await navigator.clipboard.readText();

    const result = [] as DataType[];
    let prev = "";
    for (let line of text.split(/\r?\n/)) {
      if (line === "null" || line === "NULL") {
        result.push({ data: line, fixedData: prev });
      } else {
        result.push({ data: line, fixedData: line });
        prev = line;
      }
    }

    setData(result);
  };

  useEffect(() => {
    if (data.length > 0) {
      window.scrollTo(0, 0);
      toast.success("Novi podatki");
    }
  }, [data]);

  return (
    <div className="dark">
      <ToastContainer />
      <Table data={data} headers={["Podatki", "Popravljeni podatki"]} />

      <div className="fixed top-5 ml-5">
        <Button text="Uvoz" onClick={onPasteClick} />
        <br></br>
        <Button text="Izvoz" onClick={onCopyClick} />
      </div>
    </div>
  );
}

export default App;
