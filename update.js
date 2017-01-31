
var fs = require('fs');
var plugin = require('gitbook-plugin-configurable-docs');

plugin.setVersion("2017.2.0-SNAPSHOT")

const generateStub = (groupId, artifactId)=>{
  var path = "./fractions/" + artifactId + ".adoc";
  fs.writeFileSync( path, 
                    "---\n" + "groupId: " + groupId + "\nartifactId: " + artifactId + "\n---\n");
};

const generateSummary = (data)=>{
  var fd = fs.openSync('SUMMARY.adoc','w');
  data.sort( (l,r)=>{
    return l.name.localeCompare(r.name);
  });
  data.forEach( (each)=>{
    fs.writeSync( fd, ". link:fractions/" + each.artifactId + ".adoc[" + each.name + "]\n");
  });

  fs.close(fd);
}

plugin.locateArtifact('org.wildfly.swarm', 'fraction-list', 'json')
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

