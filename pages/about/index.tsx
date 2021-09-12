import type { NextPage } from 'next'
import { GetStaticProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../../components/Layout'
import MessageBlock from '../../components/MessageBlock'
import AboutProps from '../../models/AboutProps'
import GetStaticPropHelper from '../../Helpers/GetStaticPropHelper';

const About: NextPage<AboutProps> = (props: AboutProps) => {
  return (
      <>  
        <Layout menus={props.menu} footer={props.footer} > 
          <Head>
            <title>My Photo Blog - Photography</title>
            <meta name="description" content="My Photo Blog" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className='container'>
            <MessageBlock
              title={props.about.title}
              body ={props.about.body} />
            <Image src={props.about.image} width='1038' height='692' alt={props.about.imageAlt} />
          </div>
        </Layout>
    </>
  )
}

export default About;

export const getStaticProps: GetStaticProps<AboutProps> = async (context) => { // must be async
  return await GetStaticPropHelper.getAboutPageStaticProps();
};

