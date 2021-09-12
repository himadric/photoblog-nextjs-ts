import Image from 'next/image';
import Banner from '../models/Banner';
import classes from './BlogBanner.module.scss';

export default function BlogBanner(props: Banner) {
    return (
    <div className={classes.banner}>
        <Image src={props.image} width="1903" height="476" alt={props.imageAlt} />
        <div className={classes.bannerText}>
            <p>{props.title}</p>
            <h1>{props.heading}</h1>
            <p>{props.subHeading}</p>
        </div>
    </div>
    )
}