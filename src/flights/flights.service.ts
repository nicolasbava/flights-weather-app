import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  // create(createFlightDto: CreateFlightDto) {
  //   return 'This action adds a new flight';
  // }

  findAll() {
    return this.flightRepository.find();
  }

  findOne(id: number) {
    return this.flightRepository.findOneBy({ id });
  }

  findOneByFlight(flightNum: string) {
    return this.flightRepository.findOneBy({ flightNum });
  }

  // update(id: number, updateFlightDto: UpdateFlightDto) {
  //   return `This action updates a #${id} flight`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} flight`;
  // }
}
