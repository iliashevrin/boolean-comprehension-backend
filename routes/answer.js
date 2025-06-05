import express from "express";

import { DatabaseFollowupRecord, DatabaseRecord } from "../models/Answer.js";
import { prepareQuestions, parseTable, prepareFollowupQuestions, parseFollowupTable } from "../language/Formula.js";


const router = express.Router();

router.get("/answers", async (req, res) => {
  
  try {
    // Fetch data from the database
    const data = await DatabaseRecord.find();

    const arr = [];

    data.forEach((row) => {

      var totalTime = 0;
      var totalCorrect = 0;
      var totalPairs = 0;

      const fetchTime = (category, original) => {

        if (original) {
          const time = category.original.time;
          if (time === 0) {
            return null;
          } else {
            totalTime += time;
            return time;
          }
        } else {
          const time = category.rewritten.time;
          if (time === 0) {
            return null;
          } else {
            if (category.original.time > 0) {
              totalPairs++;
            }
            totalTime += time;
            return time;
          }
        }
        
      };
      const fetchCorrect = (category, original) => {

        if (original) {
          if (category.original.time === 0) {
            return null;
          } else {
            const isCorrect = category.original.answer === category.result;
            if (isCorrect) {
              totalCorrect++;
            }
            return isCorrect;
          }
        } else {
          if (category.rewritten.time === 0) {
            return null;
          } else {
            const isCorrect = category.rewritten.answer === category.result;
            if (isCorrect) {
              totalCorrect++;
            }
            return isCorrect;
          }
        }
        
      };

      const fetchCategory = (category) => {
        
        var categoryData = {};

        categoryData[category + "_original_time"] = fetchTime(row[category], true);
        categoryData[category + "_original_correct"] = fetchCorrect(row[category], true);
        categoryData[category + "_original_index"] = row[category].original.index;
        categoryData[category + "_original_formula"] = row[category].original.formula;
        categoryData[category + "_rewritten_time"] = fetchTime(row[category], false);
        categoryData[category + "_rewritten_correct"] = fetchCorrect(row[category], false);
        categoryData[category + "_rewritten_index"] = row[category].rewritten.index;
        categoryData[category + "_rewritten_formula"] = row[category].rewritten.formula;

        return categoryData;
      };

      var csvRow = {

        "id": row._id,
        "timestamp": row.timestamp,

        "is_mobile": row.is_mobile,
        "gender": row.gender,
        "age": row.age,
        "education": row.education,
        "experience": row.experience,
        "fm": row.fm
      };

      csvRow = Object.assign(csvRow, fetchCategory("REDUCE_NEGATION_COUNT"));
      csvRow = Object.assign(csvRow, fetchCategory("REDUCE_NEGATION_COUNT_INCREASE_NEGATION_LEVEL_TRADEOFF"));
      csvRow = Object.assign(csvRow, fetchCategory("ELIMINATE_NEGATION"));
      csvRow = Object.assign(csvRow, fetchCategory("REDUCE_NEGATION_LEVEL"));
      csvRow = Object.assign(csvRow, fetchCategory("REDUCE_OPERATOR_COUNT"));
      csvRow = Object.assign(csvRow, fetchCategory("REDUCE_OPERATOR_NESTING"));
      csvRow = Object.assign(csvRow, fetchCategory("REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_DNF"));
      csvRow = Object.assign(csvRow, fetchCategory("REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_CNF"));


      csvRow["total_time"] = totalTime;
      csvRow["total_correct"] = totalCorrect;

      // A rudimentary defition of a non trivial row
      if (totalTime > 0 && totalCorrect > 0 && totalPairs > 0) {
        arr.push(csvRow);
      }

    });

    // Return the data as JSON
    res.json(arr);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});



router.get("/followup/answers", async (req, res) => {
  try {
    // Fetch data from the database (replace with your own query)
    const data = await DatabaseFollowupRecord.find();

    const arr = [];

    data.forEach((row) => {

      var totalTime = 0;
      var totalCorrect = 0;
      var totalPairs = 0;

      const fetchTime = (category) => {

        const time = category.time;
        if (time === 0) {
          return null;
        } else {
          totalTime += time;
          return time;
        }
        
      };
      const fetchCorrect = (category, result) => {

        if (category.time === 0) {
          return null;
        } else {
          const isCorrect = category.answer === result;
          if (isCorrect) {
            totalCorrect++;
          }
          return isCorrect;
        }
        
      };

      const csvRow = {

        "id": row._id,
        "timestamp": row.timestamp,

        "is_mobile": row.is_mobile,
        "gender": row.gender,
        "age": row.age,
        "education": row.education,
        "experience": row.experience,
        "fm": row.fm
      }

      row.data.forEach((data) => {

        if (data.original) {
          csvRow["" + data.index + "_original_time"] = fetchTime(data.original);
          csvRow["" + data.index + "_original_correct"] = fetchCorrect(data.original, data.result);

          if (csvRow["" + data.index + "_rewritten_time"] && csvRow["" + data.index + "_original_time"]) {
            totalPairs++;
          }

        } else if (data.rewritten) {
          csvRow["" + data.index + "_rewritten_time"] = fetchTime(data.rewritten);
          csvRow["" + data.index + "_rewritten_correct"] = fetchCorrect(data.rewritten, data.result);

          if (csvRow["" + data.index + "_original_time"] && csvRow["" + data.index + "_rewritten_time"]) {
            totalPairs++;
          }
        }

      });

      csvRow["total_time"] = totalTime;
      csvRow["total_correct"] = totalCorrect;

      // A rudimentary defition of a non trivial row
      if (totalTime > 0 && totalCorrect > 0 && totalPairs > 0) {
        arr.push(csvRow);
      }

    });

    // Return the data as JSON
    res.json(arr);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});




router.post("/followup/start-quiz", async (req, res) => {

  try {

    const formulas = new Array();
    await parseFollowupTable(formulas, "formulas_followup_final.csv");

    const questions = prepareFollowupQuestions(formulas);

    const forDatabase = {};
    const forUI = [];

    forDatabase.data = [];

    questions.forEach((q,i) => {

      const formula = q.formula.stringRepresentation();
      const assgn = Object.fromEntries(q.assignment);

      const question = {};
      
      question.assignment = assgn;
      question.result = q.result;
      question.index = q.index;
      if (q.isOriginal) {
        question.original = {};
        question.original.formula = formula;
        question.original.index = i;
      } else {
        question.rewritten = {};
        question.rewritten.formula = formula;
        question.rewritten.index = i;
      }

      forDatabase.data.push(question);

      forUI.push({formula:formula, assignment:assgn, isOriginal:q.isOriginal});
        
    });

    // Create a new quiz document
    const newQuiz = new DatabaseFollowupRecord(forDatabase);
    await newQuiz.save();

    // Send the _id back to the client
    res.json({ quizId: newQuiz._id, questions: forUI });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


router.post("/start-quiz", async (req, res) => {

  const body = req.body;
  const clientUrl = body.clientUrl;
  
  try {

    const formulas = new Map();
    formulas.set("REDUCE_NEGATION_COUNT", []);
    formulas.set("REDUCE_NEGATION_COUNT_INCREASE_NEGATION_LEVEL_TRADEOFF", []);
    formulas.set("ELIMINATE_NEGATION", []);
    formulas.set("REDUCE_NEGATION_LEVEL", []);
    formulas.set("REDUCE_OPERATOR_COUNT", []);
    formulas.set("REDUCE_OPERATOR_NESTING", []);
    formulas.set("REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_DNF", []);
    formulas.set("REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_CNF", []);

    await parseTable(formulas, "single_formulas_final.csv");

    

    const questions = prepareQuestions(formulas);

    const forDatabase = {};
    const forUI = [];
    questions.forEach((q,i) => {

      const formula = q.formula.stringRepresentation();
      const assgn = Object.fromEntries(q.assignment);

      if (!forDatabase[q.category]) {
        forDatabase[q.category] = {};
      }
      
      forDatabase[q.category].assignment = assgn;
      forDatabase[q.category].result = q.result;
      if (q.isOriginal) {
        forDatabase[q.category].original = {};
        forDatabase[q.category].original.formula = formula;
        forDatabase[q.category].original.index = i;
      } else {
        forDatabase[q.category].rewritten = {};
        forDatabase[q.category].rewritten.formula = formula;
        forDatabase[q.category].rewritten.index = i;
      }
      forUI.push({formula:formula, assignment:assgn, category:q.category, isOriginal:q.isOriginal});
        
    });

    forDatabase.url = clientUrl;

    console.log("for database:");
    console.log("=============");
    console.log(forDatabase);
    console.log("for ui:");
    console.log("=======");
    console.log(forUI);

    // Create a new quiz document
    const newQuiz = new DatabaseRecord(forDatabase);
    await newQuiz.save();

    // Send the _id back to the client
    res.json({ quizId: newQuiz._id, questions: forUI });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/answers/:quizId", async (req, res) => {
  const { answerData } = req.body;
  const { quizId } = req.params;
  console.log(quizId);
  console.log(answerData);

  try {
    // Find the document by _id and update it with the new answer
    await DatabaseRecord.findByIdAndUpdate(quizId, {
      $set: answerData, // Assuming you have an 'answers' array in your schema
    });

    console.log("1");

    const doc = await DatabaseRecord.findById(quizId);

    console.log("2");

    const field = Object.keys(answerData)[0];
    const category = field.slice(0, field.indexOf("."));
    const result = doc[category].result;

    console.log("3");

    // Return correct result
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/followup/answers/:quizId", async (req, res) => {
  const { answerData } = req.body;
  const { quizId } = req.params;
  console.log(quizId);
  console.log(answerData);

  try {
    // Find the document by _id and update it with the new answer
    await DatabaseFollowupRecord.findByIdAndUpdate(quizId, {
      $set: answerData, // Assuming you have an 'answers' array in your schema
    });

    const doc = await DatabaseFollowupRecord.findById(quizId);

    const field = Object.keys(answerData)[0];
    const index = field.split(".")[1];
    const result = doc.data[index].result;

    // Return correct result
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: error.message });
  }
});


router.post("/details/:quizId", async (req, res) => {
  const { quizId } = req.params;
  const updateData = req.body;

  console.log("Received update data:", updateData); // Log incoming data

  try {
    const updatedQuiz = await DatabaseFollowupRecord.findByIdAndUpdate(
    // const updatedQuiz = await DatabaseRecord.findByIdAndUpdate(
      quizId,
      {
        $set: updateData,
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz updated successfully", updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
