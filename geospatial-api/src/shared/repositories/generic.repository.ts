/* eslint-disable new-cap */
import { Injectable } from '@nestjs/common'
import {
  ClientSession,
  FilterQuery,
  Model,
  PipelineStage,
  Types,
} from 'mongoose'

import { Projection } from '../types'

@Injectable()
export class GenericRepository<T> {
  constructor(protected genericModel: Model<T>) {}

  async create(createEntityDto: unknown, session?: ClientSession): Promise<T> {
    const document = new this.genericModel(createEntityDto)

    await this.genericModel.create([document], { session })

    return document
  }

  async findAll(): Promise<T[]> {
    return this.genericModel.find().exec()
  }

  async find(filter: FilterQuery<T>, projection?: Projection<T>): Promise<T[]> {
    return this.genericModel.find(filter, projection).exec()
  }

  async findById(
    _id: string | Types.ObjectId,
    projection?: Projection<T>,
    selectPopulated?: string,
  ): Promise<T> {
    return this.genericModel
      .findById(_id, projection)
      .populate(selectPopulated)
      .exec()
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: Projection<T>,
  ): Promise<T> {
    return this.genericModel.findOne(filter, projection).exec()
  }

  async findOneById(
    _id: string | Types.ObjectId,
    projection?: Projection<T>,
  ): Promise<T> {
    return this.genericModel.findById(_id, projection).exec()
  }

  async update(
    _id: string | Types.ObjectId,
    entity: Partial<T>,
    projection?: Projection<T>,
  ): Promise<T> {
    return this.genericModel
      .findByIdAndUpdate(_id, entity, {
        new: true,
        projection,
      })
      .exec()
  }

  async delete(_id: string | Types.ObjectId): Promise<T> {
    return this.genericModel.findByIdAndDelete(_id).exec()
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.genericModel.aggregate(pipeline).exec()
  }

  async count(filter: FilterQuery<T>) {
    return this.genericModel.countDocuments(filter).exec()
  }

  async exists(filter: FilterQuery<T>) {
    return this.genericModel.exists(filter)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async bulkWrite(operations: any[]) {
    return this.genericModel.bulkWrite(operations)
  }

  async findByIdAndUpdate(
    _id: string | Types.ObjectId,
    update: Partial<T>,
    projection?: Projection<T>,
  ) {
    return this.genericModel.findByIdAndUpdate(_id, update, {
      new: true,
      projection,
    })
  }

  async insertMany(documents: unknown[]) {
    return this.genericModel.insertMany(documents)
  }
}
