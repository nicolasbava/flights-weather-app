import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column()
  airline: string;

  @Column({ name: 'flight_num' })
  flightNum: string;

  @Column({ name: 'origin_iata_code' })
  originIataCode: string;

  @Column({ name: 'origin_name' })
  originName: string;

  @Column({ name: 'origin_latitude', type: 'decimal', precision: 10, scale: 7 })
  originLatitude: number;

  @Column({
    name: 'origin_longitude',
    type: 'decimal',
    precision: 10,
    scale: 7,
  })
  originLongitude: number;

  @Column({ name: 'destination_iata_code' })
  destinationIataCode: string;

  @Column({ name: 'destination_name' })
  destinationName: string;

  @Column({
    name: 'destination_latitude',
    type: 'decimal',
    precision: 10,
    scale: 7,
  })
  destinationLatitude: number;

  @Column({
    name: 'destination_longitude',
    type: 'decimal',
    precision: 10,
    scale: 7,
  })
  destinationLongitude: number;
}
