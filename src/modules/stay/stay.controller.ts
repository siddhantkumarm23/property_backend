import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateStayDto } from './dto/create-stay.dto';
import { UpdateStayDto } from './dto/update-stay.dto';
import { StayService } from './stay.service';

@ApiTags('stay')
@Controller('stay')
export class StayController {
  constructor(private readonly stayService: StayService) { }

  @ApiOperation({
    summary: 'Create stay on property',
  })
  @ApiBody({ type: CreateStayDto })
  @Post()
  create(@Body() createStayDto: CreateStayDto) {
    return this.stayService.create(createStayDto);
  }

  @ApiOperation({
    summary: 'Get all stays',
  })
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Number of items per page' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.stayService.findAll(+page, +limit);
  }

  @ApiOperation({
    summary: 'Get stays by id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stayService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update stays by id',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStayDto: UpdateStayDto) {
    return this.stayService.update(id, updateStayDto);
  }

  @ApiOperation({
    summary: 'Delete stays by id',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stayService.remove(id);
  }
}
