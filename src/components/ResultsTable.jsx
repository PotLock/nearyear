import { Audio } from "react-loader-spinner";

const ResultsTable = ({
  voterWithNFT,
  winnersPerCategory,
  tiesPerCategory,
  listCreators,
  loadingVoters,
}) => {
  const downloadCSV = () => {
    const csvContent = voterWithNFT
      .map((voter) => {
        const [voterName, votedCategories] = voter;
        const votedCategoriesCount = votedCategories.length;
        return `${voterName},${votedCategoriesCount}`;
      })
      .join("\n");

    const blob = new Blob(
      [`Voter,Number of Categories Voted In\n${csvContent}`],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "votersWithNFT.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 mt-8">Winners Per Category</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-left">Winners</th>
            </tr>
          </thead>
          <tbody>
            {winnersPerCategory.map((category, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{category.title}</td>
                <td className="py-2 px-4 border-b">
                  {category.winners
                    .map((winner) => winner.account_id)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Categories with Ties</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-left">Winners</th>
            </tr>
          </thead>
          <tbody>
            {tiesPerCategory.map((category, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{category.title}</td>
                <td className="py-2 px-4 border-b">
                  {category.winners
                    .map((winner) => winner.account_id)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold my-4">Voters with NFT Qualification</h2>
      <div className="overflow-x-auto">
        {loadingVoters ? (
          <div className="flex justify-center items-center">
            <Audio height="80" width="80" color="grey" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={downloadCSV}
            >
              Download CSV
            </button>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Voter</th>
                  <th className="py-2 px-4 border-b text-left">
                    Number of Categories Voted In
                  </th>
                </tr>
              </thead>
              <tbody>
                {voterWithNFT.map((voter, index) => {
                  const [voterName, votedCategories] = voter;
                  const votedCategoriesCount = votedCategories.length;
                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-100 ${
                        listCreators.find(
                          (creator) => creator.voter === voter.voter
                        )?.isCreator
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <td className="py-2 px-4 border-b">{voterName}</td>
                      <td className="py-2 px-4 border-b">
                        {votedCategoriesCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;