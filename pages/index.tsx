import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { Animal, fetchAnimals } from "../components/homeSlice";
import Image from "next/image";
import catImage from "../components/images/garfield.png";
import dogImage from "../components/images/muttley.png";
import fishImage from '../components/images/nemo.png';
import birdImage from '../components/images/tweety.png';




const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const animals = useSelector((state: RootState) => state.home.animals);

  useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch]);

  const [selectedProduct, setSelectedProduct] = useState<{ [key: string]: string | null }>({});
  const [selectedBrand, setSelectedBrand] = useState<{ [key: string]: string | null }>({});


  const goBack = (animalId: string) => {
    if (selectedBrand[animalId]) {
      setSelectedBrand({ ...selectedBrand, [animalId]: null });
      return;
    }
    if (selectedProduct[animalId]) {
      setSelectedProduct({ ...selectedProduct, [animalId]: null });
    }
  };

  const getImageSrc = (animalName: string) => {
    switch (animalName) {
      case 'CAT':
        return catImage;
      case 'DOG':
        return dogImage;
      case 'FISH':
        return fishImage;
      case 'BIRD':
        return birdImage;
      default:
        return catImage;
    }
  };

  const themeAnimationName = (theme: any) => {
    switch (theme) {
      case 'FISH':
        return 'rotateFishColor';
      case 'BIRD':
        return 'rotateBirdColor';
      case 'DOG':
        return 'rotateDogColor';
      case 'CAT':
        return 'rotateCatColor';
      default:
        return 'rotateDefaultColor';
    }
  };

  const getBackgroundClass = (animalName: string) => {
    switch(animalName) {
      case 'FISH': return 'bg-fish';
      case 'BIRD': return 'bg-bird';
      case 'DOG': return 'bg-dog';
      case 'CAT': return 'bg-cat';
      default: return 'bg-default';
    }
  };

  const renderList = (animal: Animal) => {
    const currentSelectedProduct = selectedProduct[animal._id] || null;
    const currentSelectedBrand = selectedBrand[animal._id] || null;

    if (currentSelectedBrand) {
      const product = animal.careProducts.find(p => p.productName === currentSelectedProduct);
      const brand = product?.brands.find(b => b.brandName === currentSelectedBrand);
      return (
        <>
          <h1 className="flex justify-center text-sm md:text-xl mb-1">Brand Info</h1>
          <li className="flex justify-center text-xs md:text-lg">{brand?.brandInfo}</li>
        </>
      );
    }

    if (currentSelectedProduct) {
      const product = animal.careProducts.find(p => p.productName === currentSelectedProduct);
      return (
        <>
          <h1 className="flex justify-center text-sm md:text-xl mb-2">Product Brands</h1>
          {product?.brands.map((brand) => (
            <li key={brand.brandName} className="flex justify-center text-xs md:text-lg hover:text-rose-400 cursor-pointer" onClick={() => setSelectedBrand({ ...selectedBrand, [animal._id]: brand.brandName })}>
              {brand.brandName}
            </li>
          ))}
        </>
      );
    }

    return (
      <>
        <h1 className="flex justify-center text-xl mb-2">Products</h1>
        {animal.careProducts.map((product) => (
          <h3 className="flex justify-center text-sm md:text-xl hover:text-rose-400 cursor-pointer" onClick={() => setSelectedProduct({ ...selectedProduct, [animal._id]: product.productName })}>
            {product.productName}
          </h3>
        ))}
      </>
    );
  };

  return (
    <div className="bg-neutral-100 min-h-screen min-w-screen lg:pt-8 pt-3 flex flex-col">
      <div className="flex flex-wrap mt-2">
        {animals.map((animal) => (
          <div key={animal._id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex items-center my-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col items-center w-1/2">
                <div className="rounded-lg p-1 ml-2 transition-all duration-300 rotating-border" style={{animationName: themeAnimationName(animal.animalName)}}>
                  <Image src={getImageSrc(animal.animalName)} alt={`${animal.animalName} image`} />
                </div>
                <div className={`animal-container ${getBackgroundClass(animal.animalName)} w-full overflow-auto ml-2 md:w-2/3 h-52 p-2 flex flex-col items-center rounded-lg transition-all duration-300 rotating-border`} style={{animationName: themeAnimationName(animal.animalName)}}>
                  <h1 className="text-base md:text-xl mb-1">{animal.animalName}</h1>
                  <h3 className="text-xs md:text-sm">{animal.animalInfo}</h3>
                </div>
              </div>
              <div className={`animal-container ${getBackgroundClass(animal.animalName)} h-80 overflow-hidden hover:overflow-auto w-full md:w-1/2 mx-2 rounded-xl transition-all duration-300 rotating-border flex flex-col items-center justify-between p-4`} style={{animationName: themeAnimationName(animal.animalName)}}>
                <ul>
                  {renderList(animal)}
                </ul>
                <button className={`${selectedProduct[animal._id] || selectedBrand[animal._id] ? `${animal.animalName}-button shrink-0 p-2 textsm md:text-base` : 'hidden'}`} onClick={() => goBack(animal._id)}>Back</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
