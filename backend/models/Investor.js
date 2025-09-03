const Investor = mongoose.model('Investor', new mongoose.Schema({
  investor: String,
  company: String,
  money: Number,
}));
