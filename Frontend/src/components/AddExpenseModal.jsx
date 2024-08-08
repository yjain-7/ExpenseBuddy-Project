const [splitType, setSplitType] = useState("equal");
  const [splitData, setSplitData] = useState(null);
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false)
  const navigate = useNavigate();
  const handleAddExpenseButton = () =>{
    setIsDisabled(true)
    submitExpense()
  }
  const submitExpense = async () => {
    try {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const url = BASEURL + "expenses/addExpense";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify({ title, description, amount, splitType, splitData, groupCode, userId: auth.userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
  } else {
    alert(data.message);
    setExpenseList(data.expenseList);
    setUnsettled(data.unsettled);
    onClose();
  }
} catch (e) {
  console.log(e.message);
  setError("An error occurred while adding the expense. Please try again.");
} finally {
  setIsDisabled(false);
}
  };


  const handleUserSelected = (userId) => {
    setSelectedUserId(userId);
    console.log("Selected user ID:", userId);
	@@ -80,11 +83,6 @@ export default function AddExpenseModal({ auth, onClose, usersList, groupCode, s
    console.log("Inside Unequal split: "+JSON.stringify(selectedUserAmounts));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with split data:", splitData);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
	@@ -95,89 +93,3 @@ export default function AddExpenseModal({ auth, onClose, usersList, groupCode, s
          <X size={30} />
        </button>
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold text-center">
            Add an Expense
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              required
              className="w-full px-4 py-3 border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              required
              className="w-full px-4 py-3 border-gray-300 rounded-md mt-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter Total Amount"
              required
              className="w-full px-4 py-3 border-gray-300 rounded-md mt-4"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <div className="mt-4">
              <UserDropdown
                users={usersList}
                onUserSelected={handleUserSelected}
              />
            </div>

            {/* <p>Selected User ID: {selectedUserId}</p> */}

            <div className="mt-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="splitType"
                  value="equal"
                  checked={splitType === "equal"}
                  onChange={() => setSplitType("equal")}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Split Equally</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="splitType"
                  value="unequal"
                  checked={splitType === "unequal"}
                  onChange={() => setSplitType("unequal")}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Split Unequally</span>
              </label>
            </div>

            {splitType === "equal" && (
              <EqualSplit users={usersList} onEqualSplitChange={handleEqualSplitChange} amount={amount} />
            )}

            {splitType === "unequal" && (
              <UnequalSplit users={usersList} onUnequalSplitChange={handleUnequalSplitChange} amount={amount} />
            )}

            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-black text-white"
              disabled={isDisabled}
              onClick={handleAddExpenseButton}
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
