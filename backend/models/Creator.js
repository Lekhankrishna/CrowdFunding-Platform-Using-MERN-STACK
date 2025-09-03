const Creator = mongoose.model('Creator', new mongoose.Schema({
  company: String,
  idea: String,
  name: String,
  amount: Number,
}));