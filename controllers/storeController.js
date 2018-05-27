const mongoose = require('mongoose');
const storeModel = mongoose.model('store');

// exports.myMiddleware = (req, res, next) => {
//   req.name = 'Asvini';
//   if (req.name === 'Asvini') {
//     throw Error('It\'s awesome name');
//   }
//   next();
// }

exports.homePage = (req, res, next) => {
  res.render('index', {
    name: 'Srinivasan',
    title: 'Killer App'
  });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const store = await new storeModel(req.body).save();
  console.log('it worked!');
  req.flash('success', `Successfully Created ${store.name}. Care to leave review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await storeModel.find();
  // console.log(stores);
  res.render('store', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  const store = await storeModel.findOne({ _id: req.params.id }).exec();
  console.log(store);
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  const store = await storeModel
    .findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    })
    .exec();
  req.flash(
    'success',
    `Successfully updated store <strong>${store.name}</strong>.
  <a href='/stores/${store.slug}'>View Store</a>`
  );
  res.redirect(`/stores/${store.id}/edit`);
};
