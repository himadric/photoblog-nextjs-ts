import type { NextPage } from 'next'
import { GetStaticProps } from 'next';
import Head from 'next/head'
import Layout from '../components/Layout'
import BlogList from '../components/BlogList'
import BlogBanner from '../components/BlogBanner'
import MessageBlock from '../components/MessageBlock'
import TopicCardContainer from '../components/TopicCardContainer'
import GetStaticPropHelper from '../Helpers/GetStaticPropHelper';
import HomeProps from '../models/HomeProps';

const Home: NextPage<HomeProps> = (props: HomeProps) => {
  return (
      <>  
        <Layout menus={props.menu} footer={props.footer} > 
          <Head>
            <title>My Photo Blog</title>
            <meta name="description" content={props.pageIntro.body} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <BlogBanner 
          image={props.banner.image}
          imageAlt={props.banner.imageAlt}
          title={props.banner.title}
          heading={props.banner.heading}
          subHeading={props.banner.subHeading} />
          <div className='container'>
            <MessageBlock
              title={props.pageIntro.title}
              body ={props.pageIntro.body} />
            <TopicCardContainer topics={props.topics} />
            <BlogList blogs={props.blogs} /> 
          </div>
        </Layout>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps<HomeProps> = async () => { // must be async
  return await GetStaticPropHelper.getHomePageStaticProps("Home Page Intro", "Recent");
};

