import './index.css'

const CategoryItem = props => {
  const {categoryDetails, updateCategorySelected} = props
  const {name, categoryId} = categoryDetails

  const onCategorySelect = () => {
    updateCategorySelected(categoryId)
  }

  return (
    <li>
      <p type="button" className="category-option" onClick={onCategorySelect}>
        {name}
      </p>
    </li>
  )
}

export default CategoryItem
