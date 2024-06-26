import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import Layout from "../../components/Layout";
import { siteConfig } from "../../site.config";
import { sampleCards } from "@/utils/sample";
import Card from "@/components/Card";
import { fetchPages } from "@/utils/notion";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { IndexProps, Params, TagProps } from "@/types/types";
import { getMultiSelect } from "@/utils/property";

export const getStaticPaths: GetStaticPaths = async () => {
  console.log("getStaticPaths コール")
  const { results }: { results: Record<string, any>[] } = await fetchPages({})

  const pathSet: Set<string> = new Set();
  for(const page of results){
    for(const tag of getMultiSelect(page.properties.tags.multi_select)){
      pathSet.add(tag);
    }
  }
  const paths = Array.from(pathSet).map((tag) => {
    return {
      params: {
        tag: tag
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
  console.log(ctx.params)
  const {tag} = ctx.params as Params

  const { results } = await fetchPages({tag: tag});

  console.log(results)

  return {
    props: {
      pages: results ? results : [],
      tag: tag
    },
    revalidate: 10,  //10s
  }

}

const inter = Inter({ subsets: ["latin"] });

const Tag: NextPage<TagProps> = ({ pages, tag }) => {
  console.log(pages)

  return (
    <Layout>
      <div className="pt-12">
        <h1 className="text-5xl mb-8">{`#${tag}`}</h1>
        <div className="grid md:gap-6 mt-10 md:grid-cols-2 w-full my-12">
          {/* Card */}
          {pages.map((page, index) => {
            return (
              <Card key={index} page={page} />
            )
          }) }
        </div>
      </div>
    </Layout>

  );
}

export default Tag;
