import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController } from "chart.js";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

const FoodLoggingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mealLog, setMealLog] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [chartData, setChartData] = useState({});
  const [user, setUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const API_URL = "https://trackapi.nutritionix.com/v2/search/instant";
  const NUTRIENT_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients";
  const API_APP_ID = "48a0e1ef";
  const API_KEY = "a43bfdb230b0d88ac649873ac34bd270";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchMealLogFromFirebase(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMealLogFromFirebase = async (uid) => {
    try {
      const docRef = doc(db, "mealLogs", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMealLog(docSnap.data().mealLog || {});
      }
    } catch (error) {
      console.error("Error fetching meal log from Firebase:", error);
    }
  };

  const saveMealLogToFirebase = async (updatedMealLog) => {
    if (!user) return;

    try {
      const docRef = doc(db, "mealLogs", user.uid);
      await setDoc(docRef, { mealLog: updatedMealLog }, { merge: true });
    } catch (error) {
      console.error("Error saving meal log to Firebase:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const response = await fetch(`${API_URL}?query=${searchQuery}`, {
        headers: {
          "x-app-id": API_APP_ID,
          "x-app-key": API_KEY,
        },
      });
      const data = await response.json();
      setSearchResults(data.common || []);
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchNutrientDetails = async (foodName) => {
    try {
      const response = await fetch(NUTRIENT_URL, {
        method: "POST",
        headers: {
          "x-app-id": API_APP_ID,
          "x-app-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: foodName }),
      });
      const data = await response.json();
      return data.foods[0];
    } catch (error) {
      console.error("Error fetching nutrient details:", error);
      return null;
    }
  };

  const addToMealLog = async (food, grams) => {
    const nutrientData = await fetchNutrientDetails(food.food_name);
    if (nutrientData) {
      const servingWeight = nutrientData.serving_weight_grams || 1;
      const caloriesPerGram = (nutrientData.nf_calories || 0) / servingWeight;

      const updatedMealLog = {
        ...mealLog,
        [selectedDate]: [
          ...(mealLog[selectedDate] || []),
          {
            id: nutrientData.food_name,
            label: nutrientData.food_name,
            grams: grams,
            calories: caloriesPerGram * grams,
          },
        ],
      };

      setMealLog(updatedMealLog);
      saveMealLogToFirebase(updatedMealLog);
    }
  };

  const removeFromMealLog = (id) => {
    const updatedMealLog = {
      ...mealLog,
      [selectedDate]: mealLog[selectedDate].filter((item) => item.id !== id),
    };

    setMealLog(updatedMealLog);
    saveMealLogToFirebase(updatedMealLog);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const calculateMonthlyCalories = (mealLog, selectedMonth) => {
    const month = selectedMonth.slice(0, 7); // Format: YYYY-MM
    const monthlyCalories = {};
  
    for (const date in mealLog) {
      if (date.startsWith(month)) {
        const dailyTotal = mealLog[date]?.reduce((sum, food) => sum + food.calories, 0);
        monthlyCalories[date] = dailyTotal; // Use the full date as key
      }
    }
  
    return monthlyCalories;
  };
  
  const formatMonth = (dateString) => {
    const [year, month] = dateString.split("-");
    const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(year, month - 1)
    );
    return `${year} ${monthName}`;
  };
  
  useEffect(() => {
    const selectedMonth = selectedDate.slice(0, 7); // Extract YYYY-MM
    const monthlyCalories = calculateMonthlyCalories(mealLog, selectedMonth);
  
    // Sort dates in ascending order
    const sortedDates = Object.keys(monthlyCalories).sort(); // Sorts dates in ascending order
    const sortedCalories = sortedDates.map((date) => monthlyCalories[date]);
  
    setChartData({
      labels: sortedDates,
      datasets: [
        {
          label: `Calories in ${formatMonth(selectedMonth)}`, // Format to "2025 January"
          data: sortedCalories,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    });
  }, [mealLog, selectedDate]);

  useEffect(() => {
    const ctx = document.getElementById("myChart").getContext("2d");

    if (window.chartInstance) {
      window.chartInstance.destroy();
    }

    const chart = new ChartJS(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Calories Trend",
          },
        },
      },
    });

    window.chartInstance = chart;

    return () => {
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-500 to-blue-700 text-white">
      <Header />
      <main className="flex-grow p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Food Search and Logging</h2>
        <div className="mb-8 text-center">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
          />
        </div>
        <form
          onSubmit={handleSearch}
          className="flex items-center max-w-2xl mx-auto mb-8"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food items..."
            className="flex-grow px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-500 px-6 py-2 rounded-r-lg hover:bg-green-600 transition"
          >
            Search
          </button>
        </form>

        {isSearching && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex items-center gap-2 bg-white text-gray-800 px-6 py-4 rounded-lg shadow-lg">
              <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
              <span>Searching...</span>
            </div>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 mb-8 text-gray-800 overflow-y-auto max-h-60">
            <h3 className="text-xl font-bold mb-4">Search Results</h3>
            <ul>
              {searchResults.map((food, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row justify-between items-center border-b py-2"
                >
                  <span className="mb-2 md:mb-0">{food.food_name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Grams"
                      min="1"
                      step="1"
                      value={food.inputGrams || ""}
                      onChange={(e) => {
                        const updatedResults = [...searchResults];
                        updatedResults[index] = {
                          ...updatedResults[index],
                          inputGrams: e.target.value,
                        };
                        setSearchResults(updatedResults);
                      }}
                      className="px-2 py-1 w-20 rounded-lg border focus:outline-none"
                    />
                    <button
                      onClick={() => addToMealLog(food, food.inputGrams)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                      disabled={!food.inputGrams}
                    >
                      Add
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 text-gray-800">
          <h3 className="text-xl font-bold mb-4">Your Meal Log</h3>
          {mealLog[selectedDate]?.length > 0 ? (
            <ul>
              {mealLog[selectedDate].map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>
                    {item.label} - {item.grams} g - {item.calories.toFixed(2)} kcal
                  </span>
                  <button
                    onClick={() => removeFromMealLog(item.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No meals logged for this date.</p>
          )}
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 mt-8">
          <h3 className="text-xl font-bold mb-4 text-center">Calories Trend</h3>
          <canvas id="myChart"></canvas>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoodLoggingPage;
