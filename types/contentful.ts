export interface AboutCollectionQueryResponse {
  aboutCollection: {
    items: About[]
  }
}

export interface About {
  sys: {
    publishedAt: string
  }
  name: string
  description: string
  aboutMe: string
  profile: {
    url: string
  }
}

export interface BlogPostQueryResponse {
  blogPostCollection: {
    items: BlogPost[]
    total?: number
  }
}

export interface BlogPost {
  sys: {
    publishedAt: string
  }
  publishDate: string
  title: string
  slug: string
  author: {
    name: string
  }
  description: string
  body: string
  heroImage: {
    url: string
    description: string
  }
  transitCollection: {
    items: Transit[]
  }
}

export interface TransitLiveTime {
  transitName?: string
  liveAt: string
}

export interface Transit {
  title: string
  planet: string
  sign: string
  aspect: string | null
  transitingPlanet: string | null
  transitingSign: string | null
  foods?: string | string[]
  transitTimeCollection?: {
    items: TransitLiveTime[]
  }
}

/** Transit with its latest live instant resolved for display. */
export interface TransitWithLiveAt extends Transit {
  liveAtUtc: Date
  liveAtLabel: string
}

export interface TransitQueryResponse {
  transitCollection: {
    items: Transit[]
    total?: number
  }
}

export interface TransitsProps {
  transits: Array<Transit | TransitWithLiveAt> | undefined
}

export interface RenderMarkdownNode {
  key: string
  attributes: {
    src?: string
    alt?: string
  }
  [key: string]: any // To account for other possible node attributes
}

export interface MarkdownStyles {
  _VIEW_SAFE_image: object
}
