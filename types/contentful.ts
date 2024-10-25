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
  }
}

export interface BlogPost {
  sys: {
    publishedAt: string
  }
  title: string
  slug: string
  author: {
    name: string
  }
  description: string
  body: string
  heroImage: {
    url: string
  }
  transitCollection: {
    items: Transit[]
  }
}

export interface Transit {
  title: string
  planet: string
  sign: string
  aspect: string
  transitingPlanet: string
  transitingSign: string
  foods?: string
}

export interface TransitsProps {
  transits: Transit[] | undefined
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
