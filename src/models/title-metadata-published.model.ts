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
  public titleId?: string | null;

  @Column({ name: 'title_name' })
  public titleName?: string | null;

  @Column({ name: 'title_type' })
  public titleType?: string | null;

  @Column({ name: 'title_active', type: 'tinyint' })
  public titleActive!: number | 0;

  @Column({ name: 'brand_id' })
  public brandId?: string | null;

  @Column({ name: 'asset_id' })
  public assetId?: string | null;

  @Column({ name: 'episode_active', type: 'tinyint' })
  public episodeActive!: number | 0;

  @Column({ name: 'episode_type' })
  public episodeType?: string | null;

  @Column({ name: 'episode_no' })
  public episodeNo?: string | null;

  @Column({ length: 1000 })
  public categories?: string | null;
  
  @Column({ name: 'published_date', type: 'timestamp' })
  public publishedDate?: string | null;
  
  @Column({ name: 'timestamp', type: 'timestamp' })
  public timestamp?: string;
  
}
