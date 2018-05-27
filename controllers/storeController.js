const mongoose = require('mongoose');
const storeModel = mongoose.model('store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ error: "The file type isn't allowed" }, false);
    }
  }
};

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

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // If there is no new file to resize
  if (!req.file) {
    next();
    return;
  }
  // console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
  const store = await new storeModel(req.body).save();
  // console.log('it worked!');
  req.flash('success', `Successfully Created ${store.name}. Care to leave review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await storeModel.find();
  // console.log(stores);
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  const store = await storeModel.findOne({ _id: req.params.id }).exec();
  console.log(store);
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';

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

exports.getStoreBySlug = async (req, res, next) => {
  const store = await storeModel.findOne({ slug: req.params.slug }).exec();
  if (!store) return next();
  res.render('store', { store, title: store.name });
};
