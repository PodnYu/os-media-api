import { ObjectsController } from '../api/objects/objects.controller';
import { ObjectsService } from '../api/objects/objects.service';
import { s3Client } from '../services';
import { validateContentType, validateObjectId } from './middleware';
import { Router } from '../http/types';
import { config } from '../config';

const objectsService = new ObjectsService(s3Client, config.aws.s3BucketName);
const objectsController = new ObjectsController(objectsService);

export const objectsRouter: Router = {
	prefix: '/api/v1/objects',
	routes: [
		{
			path: ':id',
			handler: objectsController.create.bind(objectsController),
			method: 'POST',
			middleware: [validateObjectId, validateContentType],
		},
		{
			path: ':id',
			handler: objectsController.getById.bind(objectsController),
			method: 'GET',
			middleware: [validateObjectId],
		},
		{
			path: ':id',
			handler: objectsController.updateById.bind(objectsController),
			method: 'PUT',
			middleware: [validateObjectId, validateContentType],
		},
		{
			path: ':id',
			handler: objectsController.deleteById.bind(objectsController),
			method: 'DELETE',
			middleware: [validateObjectId],
		},
	],
};
