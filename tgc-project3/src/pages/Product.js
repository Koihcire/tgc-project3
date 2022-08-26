import { Fragment, useContext, useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../index.css"

export default function Product(props) {
    const BASE_API_URL = 'https://tgc-ec-merinology.herokuapp.com/api/products/'
    // eg:/products/:productId
    // useparams will return an object with all the parameters and their values just like req.params in express
    const { productId } = useParams();
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState('');
    const [activeProductVariants, setActiveProductVariants] = useState([]);
    const [selectedProductVariant, setSelectedProductVariant] = useState('');
    const context = useContext(ProductContext);
    const product = context.getProductById(parseInt(productId));



    const getVariantsData = async (productId) => {
        let variantsResponse = await axios.get(BASE_API_URL + productId)
        let variants = variantsResponse.data
        setVariants (variants)

        let firstVariant = variants[0].id
        setSelectedVariant(firstVariant)

        let firstProductVariantsResponse = await axios.get(BASE_API_URL + productId + '/' + firstVariant)
        let firstProductVariants = firstProductVariantsResponse.data
        setActiveProductVariants(firstProductVariants)
    }

    const getProductVariantData = async (productId, variantId) => {
        let activeProductVariantResponse = await axios.get(BASE_API_URL + productId + '/' + variantId)
        let activeProductVariant = activeProductVariantResponse.data
        setActiveProductVariants(activeProductVariant)
    }

    useEffect(() => {
        console.log(productId)
        async function fetchVariantsData() {
            await getVariantsData(productId)
        }
        fetchVariantsData();
    }, [])

    const selectVariant = (variantId)=>{
        setSelectedProductVariant('')
        setSelectedVariant(variantId)
        getProductVariantData(productId, variantId)
        return true;
    }

    const selectProductVariant = (productVariantId) => {
        setSelectedProductVariant(productVariantId)
    }

    if (product) {
        return (
            <Fragment>
                <div className='buffer-top'></div>
                <div className='container row'>
                    <div className='col col-12 col-lg-8'>
                        <h1>{product.product}</h1>
                        <div>
                            <img src={product.product_image_url} style={{width: "30%"}} alt="product_image"></img>
                        </div>
                        <p>{product.description}</p>

                    </div>
                    <div className='col col-12 col-lg-4'>
                        <h4>$ {(product.cost / 100).toFixed(2)}</h4>
                        <h4>Fit: {product.fit.fit}</h4>
                        <h4>Micron: {product.micron.micron}: {product.micron.micron_description}</h4>
                        <h4>Blend: {product.blend.blend}: {product.blend.blend_description}</h4>
                        <h4>Colors</h4>
                        {variants.map(variant =>
                            <Fragment key={variant.id}>
                                <input type="radio" className='btn-check' value={variant.id} name="variants" id={variant.color_name} checked={selectedVariant === variant.id} onChange={()=>{selectVariant(variant.id)}} />
                                {selectedVariant===variant.id ? 
                                <label className='btn variant-circle me-2 custom-selected' style={{backgroundColor: variant.color_code}} for={variant.color_name}></label> :
                                <label className='btn variant-circle me-2' style={{backgroundColor: variant.color_code}} for={variant.color_name}></label>}
                            </Fragment>
                        )}
                        <h4>Sizes</h4>
                        {activeProductVariants.map(productVariant => 
                            <Fragment key={productVariant.id}>
                                <div>
                                    <input type='radio' value={productVariant.id} name="productVariant" id={productVariant.id} checked={selectedProductVariant === productVariant.id} onChange={()=>{selectProductVariant(productVariant.id)}} />
                                    <label for={productVariant.id}>{productVariant.size.size}</label>
                                    <p>Stock : {productVariant.stock}</p>
                                </div>
                            </Fragment>
                        )}
                        <div>
                            <button className='btn btn-sm btn-primary' >Add to Cart</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    } else {
        return (
            <h1>page loading</h1>
        )
    }

}