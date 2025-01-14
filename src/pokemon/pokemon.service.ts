import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
   try {
    const pokemon = await this.pokemonModel.create( createPokemonDto)
    return pokemon;
   } catch (error) {
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon`)
   }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon:Pokemon

    if(!isNaN (+term)){
      pokemon= await this.pokemonModel.findOne({no: term})
    }

    if(isValidObjectId( term )){
      pokemon = await this.pokemonModel.findById(term)
    }
    if(!pokemon){
      pokemon= await this.pokemonModel.findOne({name:term.toLowerCase().trim()})
    }

    if(!pokemon) throw new NotFoundException(`Pokemon not found`)
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne( term)
  }

  async remove(id: string) {
    const {deletedCount}= await this.pokemonModel.deleteOne({_id: id})
    if(deletedCount ===0) throw new BadRequestException(`Pokemo whit id ${id} not found`)
    return 
  }
}
