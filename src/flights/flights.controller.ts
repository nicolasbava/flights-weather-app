import { Controller, Get, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';
// import { CreateFlightDto } from './dto/create-flight.dto';
// import { UpdateFlightDto } from './dto/update-flight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  // @Post()
  // create(@Body() createFlightDto: CreateFlightDto) {
  //   return this.flightsService.create(createFlightDto);
  // }

  @Get()
  findAll() {
    return this.flightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.flightsService.findOne(+id);
  }

  @Get('/flight/:id')
  findOneByFlight(@Param('id') idFlight: string) {
    return this.flightsService.findOneByFlight(idFlight);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
  //   return this.flightsService.update(+id, updateFlightDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.flightsService.remove(+id);
  // }
}
