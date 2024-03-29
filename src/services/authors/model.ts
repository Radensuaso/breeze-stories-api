import mongoose from 'mongoose';
import AuthorSchema from './schema';
import { AuthorDocument, AuthorModelType } from '../../types/Author';

const { model } = mongoose;

const AuthorModel = model<AuthorDocument, AuthorModelType>(
    'author',
    AuthorSchema
);

export default AuthorModel; 
