import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

@Entity({
  name: 'titles_metadata_published',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class TitleMetadataPublished {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ name: 'title_id' })
  public titleId!: string | null;

  @Column({ name: 'title_name' })
  public titleName!: string | null;

  @Column({ name: 'title_summary', length: 4000 })
  public titleSummary!: string | null;

  @Column({ name: 'title_type' })
  public titleType!: string | null;

  @Column({ name: 'title_active', type: 'tinyint' })
  public titleActive!: number | 0;

  @Column({ name: 'title_url_image_portrait' })
  public titleUrlImagePortrait!: string | null;

  @Column({ name: 'title_url_image_landscape' })
  public titleUrlImageLandscape!: string | null;

  @Column({ name: 'brand_id' })
  public brandId!: string | null;

  @Column({ name: 'asset_id' })
  public assetId!: string | null;

  @Column({ name: 'asset_active', type: 'tinyint' })
  public assetActive!: number | 0;

  @Column({ name: 'asset_type' })
  public assetType!: string | null;

  @Column({ name: 'asset_url_image_portrait' })
  public assetUrlImagePortrait!: string | null;

  @Column({ name: 'asset_url_image_landscape' })
  public assetUrlImageLandscape!: string | null;

  @Column({ name: 'episode_no', type: 'int' })
  public episodeNo!: number | null;

  @Column({ name: 'season_no', type: 'int' })
  public seasonNo!: number | null;

  @Column({ name: 'episode_summary', length: 4000 })
  public episodeSummary!: string | null;

  @Column({ length: 1000 })
  public categories!: string | null;
  
  @Column({ name: 'published_date', type: 'timestamp' })
  public publishedDate!: string | null;
  
  @Column({ name: 'timestamp', type: 'timestamp' })
  public timestamp?: string;
  
}
