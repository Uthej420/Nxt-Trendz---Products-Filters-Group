import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const fetchResultsConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failed: 'FAILED',
  noProducts: 'NO_PRODUCTS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    categorySelected: '',
    ratingSelected: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      searchInput,
      categorySelected,
      ratingSelected,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchInput}&category=${categorySelected}&rating=${ratingSelected}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))

      if (fetchedData.products.length !== 0) {
        this.setState({
          productsList: updatedData,
          isLoading: false,
          searchInput: '',
          fetchResult: fetchResultsConstants.success,
        })
      } else {
        this.setState({
          isLoading: false,
          searchInput: '',
          fetchResult: fetchResultsConstants.noProducts,
        })
      }
    } else if (!response.ok) {
      this.setState({
        isLoading: false,
        searchInput: '',
        fetchResult: fetchResultsConstants.failed,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailureView = () => (
    <div className="all-products-container">
      <div className="failure-view-container">
        <img
          className="failure-view-image"
          alt="products failure"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        />
        <h1 className="failure-fetch-text">Oops! Something Went Wrong</h1>
        <p>We are having some trouble processing your request.</p>
        <p className="failure-fetch-description-2">Please try again.</p>
      </div>
    </div>
  )

  renderNoProductsView = () => (
    <div className="all-products-container">
      <div className="no-products-view-container">
        <img
          className="no-products-view-container"
          alt="no products"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        />
        <h1 className="no-products-text">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    </div>
  )

  renderFullFetchedField = () => {
    const {fetchResult} = this.state

    switch (fetchResult) {
      case fetchResultsConstants.success:
        return this.renderProductsList()
      case fetchResultsConstants.failed:
        return this.renderFailureView()
      case fetchResultsConstants.noProducts:
        return this.renderNoProductsView()

      default:
        return null
    }
  }

  updateSearchInputValue = searchedText => {
    this.setState({searchInput: searchedText}, this.getProducts)
  }

  updateCategorySelected = categoryId => {
    this.setState({categorySelected: categoryId}, this.getProducts)
  }

  updateRatingSelected = ratingId => {
    this.setState({ratingSelected: ratingId}, this.getProducts)
  }

  resetFilters = () => {
    console.log('reset event')
    this.setState(
      {
        searchInput: '',
        categorySelected: '',
        ratingSelected: '',
      },
      this.getProducts,
    )
  }

  render() {
    const {isLoading} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          updateSearchInputValue={this.updateSearchInputValue}
          updateCategorySelected={this.updateCategorySelected}
          updateRatingSelected={this.updateRatingSelected}
          resetFilters={this.resetFilters}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
