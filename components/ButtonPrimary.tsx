import Link from 'next/link'
import ButtonPrimaryModel from '../models/ButtonPrimaryModel';
import classes from './ButtonPrimary.module.scss';

export default function ButtonPrimary(props: ButtonPrimaryModel) {
    return (
        <div className={classes.btnContainer}>
            <Link href={props.link} passHref>
                <a aria-label={props.caption} className={classes.btnPrimary}>{props.caption}</a>
            </Link>
        </div>
    )
}