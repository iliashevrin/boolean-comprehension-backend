import mongoose from "mongoose";

const formulaSchema = new mongoose.Schema({
  formula: {
    type: String,
    required: true,
  },

  index: {
    type: Number
  },

  time: {
    type: Number,
    default: 0,
  },
  answer: {
    type: Boolean,
    default: null,
  },

});
const categorySchema = new mongoose.Schema({

  original: formulaSchema,
  rewritten: formulaSchema,
  index: {
    type: Number,
    default: 0,
  },

  assignment: {
    type: Object,
    required: true,
  },
  result: {
    type: Boolean,
    default: null
  },
  
});

// Main schema for the database record
const databaseRecordSchema = new mongoose.Schema({
  gender: { type: String, default: null },
  age: { type: Number, default: null },
  education: { type: String, default: NaN },
  experience: { type: Number, default: null },
  fm: { type: String, default: NaN },
  is_mobile: { type: Boolean, default: null },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  url: { type: String, default: null },

  REDUCE_NEGATION_COUNT: { type: categorySchema, default: null },
  REDUCE_NEGATION_COUNT_INCREASE_NEGATION_LEVEL_TRADEOFF: { type: categorySchema, default: null },
  ELIMINATE_NEGATION: { type: categorySchema, default: null },
  REDUCE_NEGATION_LEVEL: { type: categorySchema, default: null },
  REDUCE_OPERATOR_COUNT: { type: categorySchema, default: null },
  REDUCE_OPERATOR_NESTING: { type: categorySchema, default: null },
  REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_DNF: { type: categorySchema, default: null },
  REDUCE_OPERATOR_NESTING_INCREASE_OPERATOR_COUNT_TRADEOFF_CNF: { type: categorySchema, default: null },
});
const DatabaseRecord = mongoose.model("DatabaseRecord", databaseRecordSchema);


const databaseFollowupRecordSchema = new mongoose.Schema({
  gender: { type: String, default: null },
  age: { type: Number, default: null },
  education: { type: String, default: NaN },
  experience: { type: Number, default: null },
  fm: { type: String, default: NaN },
  is_mobile: { type: Boolean, default: null },
  timestamp: {
    type: Date,
    default: Date.now,
  },

  data: [categorySchema]
})
const DatabaseFollowupRecord = mongoose.model("DatabaseFollowupRecord", databaseFollowupRecordSchema);

export { DatabaseFollowupRecord, DatabaseRecord };
