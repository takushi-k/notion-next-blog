import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import Layout from "../components/Layout";
import { siteConfig } from "../site.config";
import { sampleCards } from "@/utils/sample";
import Card from "@/components/Card";
import { fetchPages } from "@/utils/notion";
import { GetStaticProps, NextPage } from "next";
import { IndexProps } from "@/types/types";

export const getStaticProps: GetStaticProps = async () => {
  console.log("index.tsx - getStaticProps");

  const { results } = await fetchPages({});

  console.log("results");
  console.log(results);

  return {
    props: {
      pages: results ? results : []
    },
    revalidate: 10,  //10s
  }

}

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage<IndexProps> = ({ pages }) => {
  console.log(pages)

  return (
    <Layout>
      <div className="pt-12">
        <h1 className="text-5xl mb-8">{siteConfig.title}</h1>
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

export default Home;
