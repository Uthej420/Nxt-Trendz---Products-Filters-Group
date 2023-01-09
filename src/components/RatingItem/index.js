import './index.css'

const RatingItem = props => {
  const {ratingDetails, updateRatingSelected} = props
  const {imageUrl, ratingId} = ratingDetails

  const onRatingSelect = () => {
    updateRatingSelected(ratingId)
  }
  return (
    <li className="list-container">
      <button type="button" className="rating-button" onClick={onRatingSelect}>
        <img
          src={imageUrl}
          className="rating-image"
          alt={`rating ${ratingId}`}
        />
        <p className="and-above-text">{` & up`}</p>
      </button>
    </li>
  )
}

export default RatingItem
