
var fs = require('fs');
var plugin = require('gitbook-plugin-reference-guide');

plugin.setVersion("2017.9.0-SNAPSHOT")

const generateStub = (groupId, artifactId)=>{
  var path = "./fractions/" + artifactId + ".adoc";
  fs.writeFileSync( path,
                    "---\n" + "groupId: " + groupId + "\nartifactId: " + artifactId + "\n---\n");
};

const generateSummary = (data)=>{
  var before = fs.readFileSync('SUMMARY_BEFORE.adoc');
  var after = fs.readFileSync('SUMMARY_AFTER.adoc');

  var fd = fs.openSync('SUMMARY.adoc','w');
  fs.writeSync( fd, before.toString() );
  data.sort( (l,r)=>{
    return l.name.localeCompare(r.name);
  });
  data.forEach( (each)=>{
    fs.writeSync( fd, ". link:fractions/" + each.artifactId + ".adoc[" + each.name + "]\n");
  });
  fs.writeSync( fd, after.toString() );
  fs.close(fd);
}

plugin.locateArtifact('org.wildfly.swarm', 'fraction-metadata', 'json')
  .then( (path)=>{
    var data = JSON.parse( fs.readFileSync( path ) );
    data.forEach( (each)=>{
      generateStub( each.groupId, each.artifactId );
    })
    generateSummary( data );
  })
  .catch( (err)=>{
    console.log( "problem", err );
  });
