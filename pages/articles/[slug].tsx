import ArticleMeta from '@/components/ArticleMeta'
import Block from '@/components/Block'
import Layout from '@/components/Layout'
import { ArticleProps, Params } from '@/types/types'
import { fetchBlocksByPageId, fetchPages } from '@/utils/notion'
import { getText } from '@/utils/property'
import { sampleCards } from '@/utils/sample'
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import React from 'react'
import NotionBlocks from "notion-block-renderer"

export const getStaticPaths: GetStaticPaths = async () => {
  console.log("getStaticPaths")
  const {results} = await fetchPages({})
  const paths = results.map((page: any) => {
    return {
      params: {
        slug: getText(page.properties.slug.rich_text),
      }
    }
  })
  console.log(paths)

  return {
    paths: paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log("getStaticProps 実施")
  console.log(ctx.params)
  // http://localhost:3000/articles/green?a=1&b=2 でアクセスした場合
  // { slug: 'green' }

  const { slug } = ctx.params as Params

  const {results} = await fetchPages({ slug: slug })
  const page = results[0]
  const pageId = page.id
  const { results: blocks } = await fetchBlocksByPageId(pageId)

  return {
    props: {
      page: page,
      blocks: blocks
    },
    revalidate: 10,
  }
}


const Article: NextPage<ArticleProps> = ({ page, blocks }) => {

  console.log("Article コール")
  console.log(page)
  console.log(blocks)

  return (
    <Layout>
      <article className="w-full">
        {/* meta section */}
        <div className="my-12">
          <ArticleMeta page={page}/>
        </div>

        {/* article */}
        {/* <div className="my-12">
          {blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div> */}

        <div className="my-12">
          <NotionBlocks blocks={blocks} isCodeHighlighter={true} />
        </div>
      </article>
    </Layout>
  )
}

export default Article


