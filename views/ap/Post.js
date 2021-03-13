import React from 'react'
import SanitizedHTML from 'react-sanitized-html'
import { FormattedRelativeTime } from 'react-intl'
import ImmersHandle from '../components/ImmersHandle'
import ProfileIcon from '../components/ProfileIcon'
import './Post.css'

export default function Post ({ actor, summary, object = {}, published }) {
  const { id: actorId, name, preferredUsername, icon } = actor
  const { context } = object

  const body = getPostBody(object)
  if (body) {
    return (
      <div>
        <div className='postHeader'>
          <div className='handle'>
            <div className='tinyIconWrapper'>
              <ProfileIcon className='tinyIcon' icon={icon} />
            </div>
            {name} &ndash;
            {' '}<ImmersHandle id={actorId} preferredUsername={preferredUsername} />
          </div>
          <ImmerLink place={context} />
          <Timestamp published={published} />
        </div>

        <div className='aesthetic-windows-95-container-indent'>
          {body}
        </div>
      </div>
    )
  }
  if (summary) {
    return (
      <div className='postHeader'>
        <SanitizedHTML className='lesserPost' html={summary} />
        <Timestamp published={published} />
      </div>
    )
  }
  return null
}

function getPostBody ({ type, content, url }) {
  switch (type) {
    case 'Note':
      return <SanitizedHTML html={content} />
    case 'Image':
      return <img className='postMedia' src={url} />
    case 'Video':
      return <video className='postMedia' src={url} controls />
  }
  return null
}

function Timestamp ({ published }) {
  let timestamp
  try {
    timestamp = new Date(published)
  } catch (ignore) {}
  if (published && timestamp) {
    return (
      <span className='lesserPost timestamp'>
        <FormattedRelativeTime updateIntervalInSeconds={10} value={(timestamp - Date.now()) / 1000} />
      </span>
    )
  }
  return null
}

export function ImmerLink ({ place }) {
  if (!place?.url) {
    return null
  }
  let placeUrl = place.url
  // inject user handle into desintation url so they don't have to type it
  try {
    const url = new URL(placeUrl)
    const search = new URLSearchParams(url.search)
    // search.set('me', window.APP.store.state.profile.handle)
    url.search = search.toString()
    placeUrl = url.toString()
  } catch (ignore) {
    /* if fail, leave original url unchanged */
  }
  return placeUrl ? <a href={placeUrl}>{place.name || 'unkown'}</a> : null
}