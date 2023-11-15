import mongoose, { Schema, Document } from 'mongoose';

interface IBrand extends Document {
  brandName: string;
  brandInfo: string;
}

interface IProduct extends Document {
  productName: string;
  brands: IBrand[];
}

interface IAnimal extends Document {
  animalName: string;
  animalInfo: string;
  careProducts: IProduct[];
}

const BrandSchema: Schema = new Schema({
  brandName: { type: String },
  brandInfo: { type: String }
});

const ProductSchema: Schema = new Schema({
  productName: { type: String },
  brands: [BrandSchema]
});

const AnimalSchema: Schema = new Schema({
  animalName: { type: String },
  animalInfo: { type: String },
  careProducts: [ProductSchema]
});

const Animal = mongoose.models.Animal || mongoose.model<IAnimal>('Animal', AnimalSchema);

export default Animal;