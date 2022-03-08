import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type DataType = {
  data: string;
  fixedData: number;
};

function TableRow(data: DataType) {
  let fixedDataColor = "text-gray-500 dark:text-gray-400";
  if (data.data !== data.fixedData.toString()) {
    fixedDataColor = "text-red-500 dark:text-red-400";
  }

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {data.data}
      </td>
      <td className={`${fixedDataColor} py-4 px-6 text-sm whitespace-nowrap`}>
        {data.fixedData}
      </td>
    </tr>
  );
}

function Table({ data }: { data: DataType[] }) {
  return (
    <div className="w-1/3 mx-auto flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Podatki
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Popravljeni podatki
                  </th>
                </tr>
              </thead>
              <tbody>{data.map((el) => TableRow(el))}</tbody>
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
      .then(() => toast.success("Skopirano!"));
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
      <Table data={data} />

      <div className="fixed top-5 ml-5">
        <Button text="Uvoz" onClick={onPasteClick} />
        <br></br>
        <Button text="Izvoz" onClick={onCopyClick} />
      </div>
    </>
  );
}

export default App;
