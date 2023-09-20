const router = require('express').Router();
const users = require('../models/allUser');
const customers = require('../models/allUser');
const historyModel = require('../models/historymodel');


router.get('/', (req, res) => {
  res.render('home');
});

// ADD USER
router.get('/adduser', (req, res) => {
  res.render('addUser', { title: "Add User", msg: '' });
});

router.post('/adduser', async (req, res) => {
  try {
    const { userName, userEmail, userNumber, userAmount } = req.body;
    const User = new customers({
      name: userName,
      email: userEmail,
      contact: userNumber,
      amount: userAmount,
    });
    await User.save();
    res.render('addUser', { title: "Add User", msg: 'User Added Successfully' });
  } catch (err) {
    console.log(err);
  }
});

// View All User
router.get('/data', async (req, res) => {
  try {
    const allData = await customers.find({});
    res.render('viewUser', { title: "View Users", data: allData });
  } catch (err) {
    throw err;
  }
});

// Delete User
router.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await customers.findByIdAndDelete({ "_id": id });
    res.redirect('/data');
  } catch (err) {
    throw err;
  }
});

router.get("/view/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const Sender = customers.find({ "_id": id });
    const allUser = customers.find({});
    const [uData, rData] = await Promise.all([Sender.exec(), allUser.exec()]);
    res.render('view', { title: 'view', data: uData, records: rData });
  } catch (err) {
    throw err;
  }
});

router.post('/transfer', async (req, res) => {
  try {
    const { SenderID, SenderName, SenderEmail, reciverName, reciverEmail, transferAmount } = req.body;
    console.log(transferAmount)
    const history = new historyModel({
      sName: SenderName,
      sEmail: SenderEmail,
      rName: reciverName,
      rEmail: reciverEmail,
      amount: transferAmount
    })

    if (reciverName === 'Select Reciver Name' || reciverEmail === 'Select Reciver Email') {
      res.render('sucess', { title: "sucess", value: "", msg: "", errmsg: "All fields are require!" });
    } else {
      const Sender = customers.find({ "_id": SenderID })
      const Reciver = customers.find({ "name": reciverName, "email": reciverEmail });

      const [senderData, reciverData] = await Promise.all([Sender, Reciver]);
      senderData.forEach(async (c) => {
        if (c.name === reciverName || c.email === reciverEmail || c.amount < transferAmount) {
          res.render('sucess', { title: "sucess", value: "", msg: "", errmsg: "Process Not Complete due to incorrect reciver details!" });
        } else {
          let updateAmount = parseInt(c.amount) - parseInt(transferAmount);
          await customers.findOneAndUpdate({ "name": SenderName }, { "$set": { "amount": updateAmount } });
          await history.save();
          reciverData.forEach(async (e) => {
            let updateAmount = parseInt(e.amount) + parseInt(transferAmount);
            await customers.findOneAndUpdate({ "name": reciverName }, { "$set": { "amount": updateAmount } });
          });
        }
        res.render('sucess', { title: "sucess", value: "True", msg: "Transfer Sucessfull" });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// History
router.get('/history', async (req, res) => {
  try {
    const hist = await historyModel.find({});
    res.render('history', { title: 'History', data: hist });
  } catch (err) {
    throw err;
  }
});

router.get('/remove/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await historyModel.findByIdAndDelete({ "_id": id });
    res.redirect('/history');
  } catch (err) {
    throw err;
  }
});

module.exports = router;

